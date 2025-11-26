import express from "express";
import {
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
  applyVoucher
} from "../controllers/voucherController.js";
import {
  updateVoucherStatus
} from "../controllers/Updatetrangthai.js";

const router = express.Router();

router.get("/", getVouchers);
router.post("/", addVoucher);
router.put("/:id", updateVoucher);
router.delete("/:id", deleteVoucher);

// optional apply endpoint
router.post("/apply", applyVoucher);

// Dev truong code: gọi API để update trạng thái voucher
router.post("/update-status", updateVoucherStatus);

export default router;
