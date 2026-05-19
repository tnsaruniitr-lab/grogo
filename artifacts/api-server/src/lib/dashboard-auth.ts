import { type Request, type Response, type NextFunction } from "express";
import { timingSafeEqual, createHash } from "crypto";
import { logger } from "./logger";
import { db } from "@workspace/db";
import { clientsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const REALM = "Dosteli Dashboard";

function safeCompare(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return ha.length === hb.length && timingSafeEqual(ha, hb);
}

/**
 * Middleware for leads and dashboard routes.
 * Accepts either:
 *   1. HTTP Basic Auth (admin access — full read/write)
 *   2. ?demoToken=<token>&clientId=<id> query params (demo access — GET only, scoped to one client)
 */
export async function requireDemoOrDashboardAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers["authorization"] ?? "";

  // 1. Basic Auth path
  if (authHeader.startsWith("Basic ")) {
    const expectedUser = (process.env["DASH_USER"] ?? process.env["DASHBOARD_USER"])?.trim();
    const expectedPass = (process.env["DASH_PASS"] ?? process.env["DASHBOARD_PASS"])?.trim();
    if (!expectedUser || !expectedPass) {
      res.status(503).json({ error: "Dashboard auth not configured" });
      return;
    }
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) { res.status(401).json({ error: "Invalid credentials format" }); return; }
    const user = decoded.slice(0, colonIdx).trim();
    const pass = decoded.slice(colonIdx + 1).trim();
    if (safeCompare(user, expectedUser) && safeCompare(pass, expectedPass)) {
      return next();
    }
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // 2. Demo token path — GET requests only
  if (req.method !== "GET") {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const demoToken = req.query["demoToken"] as string | undefined;
  const clientIdStr = req.query["clientId"] as string | undefined;

  if (!demoToken || !clientIdStr) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const clientId = parseInt(clientIdStr, 10);
  if (isNaN(clientId) || clientId <= 0) {
    res.status(401).json({ error: "Invalid clientId" });
    return;
  }

  try {
    const [client] = await db
      .select({ demoToken: clientsTable.demoToken })
      .from(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .limit(1);

    if (!client?.demoToken) {
      res.status(401).json({ error: "Demo access not configured for this client" });
      return;
    }

    const ha = createHash("sha256").update(demoToken).digest();
    const hb = createHash("sha256").update(client.demoToken).digest();
    if (ha.length !== hb.length || !timingSafeEqual(ha, hb)) {
      res.status(401).json({ error: "Invalid demo token" });
      return;
    }

    next();
  } catch (err) {
    logger.error({ err }, "requireDemoOrDashboardAuth — DB error");
    res.status(500).json({ error: "Internal server error" });
  }
}

export function requireDashboardAuth(req: Request, res: Response, next: NextFunction): void {
  const expectedUser = (process.env["DASH_USER"] ?? process.env["DASHBOARD_USER"])?.trim();
  const expectedPass = (process.env["DASH_PASS"] ?? process.env["DASHBOARD_PASS"])?.trim();

  if (!expectedUser || !expectedPass) {
    logger.error({ path: req.path }, "DASHBOARD_USER or DASHBOARD_PASS not set — blocking request");
    res.status(503).json({ error: "Dashboard auth not configured" });
    return;
  }

  const authHeader = req.headers["authorization"] ?? "";
  if (!authHeader.startsWith("Basic ")) {
    logger.warn(
      {
        path: req.path,
        method: req.method,
        ip: req.ip,
        authHeaderPresent: !!authHeader,
        authHeaderPrefix: authHeader.slice(0, 12) || "(empty)",
        allHeaders: Object.keys(req.headers),
      },
      "Dashboard auth — missing or malformed Authorization header",
    );
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
  const colonIdx = decoded.indexOf(":");
  if (colonIdx === -1) {
    res.status(401).json({ error: "Invalid credentials format" });
    return;
  }

  const user = decoded.slice(0, colonIdx).trim();
  const pass = decoded.slice(colonIdx + 1).trim();

  if (!safeCompare(user, expectedUser) || !safeCompare(pass, expectedPass)) {
    logger.warn(
      { path: req.path, ip: req.ip, receivedUser: user, receivedPassLen: pass.length, expectedPassLen: expectedPass.length },
      "Dashboard auth failed — bad credentials",
    );
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  next();
}
