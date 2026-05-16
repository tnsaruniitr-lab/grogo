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
  const expectedUser = process.env["DASHBOARD_USER"];
  const expectedPass = process.env["DASHBOARD_PASS"];

  if (!expectedUser || !expectedPass) {
    logger.error({ path: req.path }, "DASHBOARD_USER or DASHBOARD_PASS not set — blocking request");
    res.status(503).json({ error: "Dashboard auth not configured" });
    return;
  }

  const authHeader = req.headers["authorization"] ?? "";
  if (!authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", `Basic realm="${REALM}"`);
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
  const colonIdx = decoded.indexOf(":");
  if (colonIdx === -1) {
    res.setHeader("WWW-Authenticate", `Basic realm="${REALM}"`);
    res.status(401).json({ error: "Invalid credentials format" });
    return;
  }

  const user = decoded.slice(0, colonIdx);
  const pass = decoded.slice(colonIdx + 1);

  if (!safeCompare(user, expectedUser) || !safeCompare(pass, expectedPass)) {
    logger.warn({ path: req.path, ip: req.ip }, "Dashboard auth failed — bad credentials");
    res.setHeader("WWW-Authenticate", `Basic realm="${REALM}"`);
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  next();
}
