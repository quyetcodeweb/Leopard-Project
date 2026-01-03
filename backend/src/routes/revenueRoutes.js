import express from "express";
import {
  getSummary,
  getLineChart,
  getRevenueByCategory,
  getTopProducts,
} from "../controllers/revenueController.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/line", getLineChart);
router.get("/category", getRevenueByCategory);
router.get("/top-products", getTopProducts);

export default router;
