import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateStock
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.put("/:id/stock", updateStock);
router.put("/:id/toggle", toggleProductStatus);

export default router;