import express from "express";
import {
  getAdmins,
  createAdmin,
  suspendAdmin,
  deleteAdmin,
  getAdminBlogs,
} from "../controllers/admin.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { requireSuperAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.use(protectedRoute, requireSuperAdmin);

router.get("/", getAdmins);
router.post("/", createAdmin);
router.patch("/:id/suspend", suspendAdmin);
router.delete("/:id", deleteAdmin);
router.get("/:id/blogs", getAdminBlogs);

export default router;
