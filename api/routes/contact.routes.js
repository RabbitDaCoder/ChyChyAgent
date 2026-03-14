import express from "express";
import {
  submitContact,
  listContacts,
  markRead,
  deleteContact,
} from "../controllers/contact.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import requireAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", protectedRoute, requireAdmin, listContacts);
router.patch("/:id/read", protectedRoute, requireAdmin, markRead);
router.delete("/:id", protectedRoute, requireAdmin, deleteContact);

export default router;
