import express from "express";
import { getAuditLogs, deleteAuditLogs, deleteAuditLogById } from "../controllers/auditLog.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Kjo linjë siguron që vetëm përdoruesit me token valid mund të marrin audit logs
router.get("/", verifyToken, getAuditLogs);
router.delete("/", verifyToken, deleteAuditLogs);
router.delete("/:id", verifyToken, deleteAuditLogById);

export default router;
