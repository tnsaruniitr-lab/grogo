import { Router, type IRouter } from "express";
import healthRouter from "./health";
import webhookRouter from "./webhook";
import leadsRouter from "./leads";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(webhookRouter);
router.use(leadsRouter);
router.use(dashboardRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
