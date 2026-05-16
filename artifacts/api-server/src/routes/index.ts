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
import { requireDashboardAuth } from "../lib/dashboard-auth";

const router: IRouter = Router();

// Public — no auth required
router.use(healthRouter);
router.use(webhookRouter);       // Twilio: signature-validated internally
router.use(respondRouter);       // Respond.io: API-key-validated internally
router.use(respondEventsRouter); // Respond.io events: API-key-validated internally
router.use(manychatRouter);      // ManyChat: x-api-key-validated internally

// Protected — Basic Auth required for all dashboard / admin / data routes
router.use(requireDashboardAuth);
router.use(leadsRouter);
router.use(dashboardRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(crawlRouter);

export default router;
