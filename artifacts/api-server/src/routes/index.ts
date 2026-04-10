import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import digitalRouter from "./digital.js";
import ordersRouter from "./orders.js";
import statsRouter from "./stats.js";
import imagesRouter from "./images.js";
import paymentRouter from "./payment.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(digitalRouter);
router.use(ordersRouter);
router.use(statsRouter);
router.use(imagesRouter);
router.use(paymentRouter);

export default router;
