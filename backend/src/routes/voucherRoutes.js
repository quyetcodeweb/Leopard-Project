import express from "express";
import {
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
  applyVoucher
} from "../controllers/voucherController.js";

const router = express.Router();

router.get("/", getVouchers);
router.post("/", addVoucher);
router.put("/:id", updateVoucher);
router.delete("/:id", deleteVoucher);

// optional apply endpoint
router.post("/apply", applyVoucher);

export default router;
