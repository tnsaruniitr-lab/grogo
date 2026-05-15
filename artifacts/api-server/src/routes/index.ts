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

const router: IRouter = Router();

router.use(healthRouter);
router.use(webhookRouter);
router.use(respondRouter);
router.use(respondEventsRouter);
router.use(manychatRouter);
router.use(leadsRouter);
router.use(dashboardRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(crawlRouter);

export default router;
