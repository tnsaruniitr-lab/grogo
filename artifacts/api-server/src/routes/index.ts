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
import { requireDashboardAuth } from "../lib/dashboard-auth";

const router: IRouter = Router();

// Public — no auth required
router.use(healthRouter);
router.use(webhookRouter);           // Twilio: signature-validated internally
router.use(respondRouter);           // Respond.io: API-key-validated internally
router.use(respondEventsRouter);     // Respond.io events: API-key-validated internally
router.use(manychatRouter);          // ManyChat: x-api-key-validated internally
router.use(extractBrandingRouter);   // Public URL fetcher — no DB access, no auth needed
router.use(adminRouter);             // Demo client management — no auth needed
router.use(crawlRouter);             // Website crawl/branding — no auth needed
router.use(storageRouter);           // Object storage (logo uploads) — no auth needed

// Protected — Basic Auth required for leads / dashboard
router.use(requireDashboardAuth);
router.use(leadsRouter);
router.use(dashboardRouter);

export default router;
