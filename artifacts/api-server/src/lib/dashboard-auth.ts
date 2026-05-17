import { type Request, type Response, type NextFunction } from "express";
import { timingSafeEqual, createHash } from "crypto";
import { logger } from "./logger";

const REALM = "Dosteli Dashboard";

function safeCompare(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return ha.length === hb.length && timingSafeEqual(ha, hb);
}

export function requireDashboardAuth(req: Request, res: Response, next: NextFunction): void {
  const expectedUser = (process.env["DASHBOARD_USER"] ?? process.env["DASH_USER"])?.trim();
  const expectedPass = (process.env["DASHBOARD_PASS"] ?? process.env["DASH_PASS"])?.trim();

  if (!expectedUser || !expectedPass) {
    logger.error({ path: req.path }, "DASHBOARD_USER or DASHBOARD_PASS not set — blocking request");
    res.status(503).json({ error: "Dashboard auth not configured" });
    return;
  }

  const authHeader = req.headers["authorization"] ?? "";
  if (!authHeader.startsWith("Basic ")) {
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
