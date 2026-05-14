import { Router, type IRouter } from "express";
import healthRouter from "./health";
import webhookRouter from "./webhook";
import leadsRouter from "./leads";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(webhookRouter);
router.use(leadsRouter);
router.use(dashboardRouter);

export default router;
