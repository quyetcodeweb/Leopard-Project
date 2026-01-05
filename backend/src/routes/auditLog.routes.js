import express from "express";
import {
  getAuditLogs,
  cleanupAuditLogs
} from "../controllers/auditLog.controller.js";

const router = express.Router();

router.get("/", getAuditLogs);
router.post("/cleanup", cleanupAuditLogs);

export default router;
