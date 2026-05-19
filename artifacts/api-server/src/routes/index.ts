import { Router, type IRouter } from "express";
import healthRouter from "./health";
import webhookRouter from "./webhook";
import respondRouter from "./respond";
import respondEventsRouter from "./respond-events";
import manychatRouter from "./manychat";
import leadsRouter from "./leads";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";
import storageRouter from "./storage";
import crawlRouter from "./crawl";
import extractBrandingRouter from "./extract-branding";
import { requireDashboardAuth, requireDemoOrDashboardAuth } from "../lib/dashboard-auth";

const router: IRouter = Router();

// Public — no auth required
router.use(healthRouter);
router.use(webhookRouter);           // Twilio: signature-validated internally
router.use(respondRouter);           // Respond.io: API-key-validated internally
router.use(respondEventsRouter);     // Respond.io events: API-key-validated internally
router.use(manychatRouter);          // ManyChat: x-api-key-validated internally
router.use(adminRouter);             // /clients/* public; /admin/* protected internally

// Protected — Basic Auth OR per-client demo token (GET-only for demo access)
router.use(requireDemoOrDashboardAuth);
router.use(leadsRouter);
router.use(dashboardRouter);

// Admin-only — Basic Auth required; demo tokens rejected by second middleware
router.use(requireDashboardAuth);
router.use(crawlRouter);
router.use(storageRouter);
router.use(extractBrandingRouter);   // Admin: SSRF-guarded URL fetcher — behind Basic Auth

export default router;
