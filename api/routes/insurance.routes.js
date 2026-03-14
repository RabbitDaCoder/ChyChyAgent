import express from "express";
import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/insurance.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import requireAdmin from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getPlans);
router.get("/:id", getPlan);
router.post("/", protectedRoute, requireAdmin, upload.single("image"), createPlan);
router.put("/:id", protectedRoute, requireAdmin, upload.single("image"), updatePlan);
router.delete("/:id", protectedRoute, requireAdmin, deletePlan);

export default router;
