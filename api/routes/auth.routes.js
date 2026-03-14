import express from "express";
import multer from "multer";
import {
  login,
  logout,
  refreshToken,
  getProfile,
  uploadProfileImage,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/me", protectedRoute, getProfile);
router.post(
  "/upload-image",
  protectedRoute,
  upload.single("file"),
  uploadProfileImage,
);

export default router;
