import Insurance from "../models/Insurance.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

export const getPlans = asyncHandler(async (_req, res) => {
  const plans = await Insurance.find().sort({ order: 1 });
  return apiResponse.success(res, plans);
});

export const getPlan = asyncHandler(async (req, res) => {
  const plan = await Insurance.findById(req.params.id);
  if (!plan) throw new AppError("Plan not found", 404, "NOT_FOUND");
  return apiResponse.success(res, plan);
});

export const createPlan = asyncHandler(async (req, res) => {
  let image;
  if (req.file) {
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const upload = await import("../libs/cloudinary.js").then((m) =>
      m.default.uploader.upload(base64, { folder: "chychy_insurance" })
    );
    image = upload.secure_url;
  }
  const payload = req.body;
  if (payload.features && typeof payload.features === "string") {
    payload.features = JSON.parse(payload.features);
  }
  const plan = await Insurance.create({ ...payload, image });
  return apiResponse.success(res, plan, 201);
});

export const updatePlan = asyncHandler(async (req, res) => {
  const payload = req.body;
  let image;
  if (req.file) {
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const upload = await import("../libs/cloudinary.js").then((m) =>
      m.default.uploader.upload(base64, { folder: "chychy_insurance" })
    );
    image = upload.secure_url;
  }
  if (payload.features && typeof payload.features === "string") {
    payload.features = JSON.parse(payload.features);
  }
  const plan = await Insurance.findByIdAndUpdate(
    req.params.id,
    { ...payload, ...(image && { image }) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!plan) throw new AppError("Plan not found", 404, "NOT_FOUND");
  return apiResponse.success(res, plan);
});

export const deletePlan = asyncHandler(async (req, res) => {
  const deleted = await Insurance.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Plan not found", 404, "NOT_FOUND");
  return apiResponse.success(res, { deleted: true });
});
