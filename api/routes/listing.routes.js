import express from "express";
import {
  getListings,
  getFeaturedListings,
  getListing,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  updateStatus,
  toggleFeaturedListing,
} from "../controllers/listing.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import requireAdmin from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getListings);
router.get("/featured", getFeaturedListings);
router.get("/by-id/:id", getListingById);
router.get("/:slug", getListing);

router.post(
  "/",
  protectedRoute,
  requireAdmin,
  upload.array("images"),
  createListing,
);
router.put(
  "/:id",
  protectedRoute,
  requireAdmin,
  upload.array("images"),
  updateListing,
);
router.delete("/:id", protectedRoute, requireAdmin, deleteListing);
router.patch("/:id/status", protectedRoute, requireAdmin, updateStatus);
router.patch(
  "/:id/feature",
  protectedRoute,
  requireAdmin,
  toggleFeaturedListing,
);

export default router;
