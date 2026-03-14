import User from "../models/User.model.js";
import Blog from "../models/Blog.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

// Super admin: get all admins
export const getAdmins = asyncHandler(async (_req, res) => {
  const admins = await User.find({ role: "admin" }).select("-password").lean();

  // Attach blog count per admin
  const adminIds = admins.map((a) => a._id);
  const blogCounts = await Blog.aggregate([
    { $match: { author: { $in: adminIds } } },
    { $group: { _id: "$author", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(
    blogCounts.map((b) => [b._id.toString(), b.count]),
  );

  const result = admins.map((admin) => ({
    ...admin,
    blogCount: countMap[admin._id.toString()] || 0,
  }));

  return apiResponse.success(res, result);
});

// Super admin: create a new admin
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError(
      "Name, email and password are required",
      400,
      "VALIDATION_ERROR",
    );
  }

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already in use", 409, "CONFLICT");

  const admin = await User.create({ name, email, password, role: "admin" });
  const { password: _, ...adminData } = admin.toObject();
  return apiResponse.success(res, adminData, 201);
});

// Super admin: suspend an admin
export const suspendAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.params.id);
  if (!admin) throw new AppError("Admin not found", 404, "NOT_FOUND");
  if (admin.role === "superadmin")
    throw new AppError("Cannot suspend a super admin", 403, "FORBIDDEN");

  admin.suspended = !admin.suspended;
  await admin.save();
  return apiResponse.success(res, { suspended: admin.suspended });
});

// Super admin: delete an admin
export const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.params.id);
  if (!admin) throw new AppError("Admin not found", 404, "NOT_FOUND");
  if (admin.role === "superadmin")
    throw new AppError("Cannot delete a super admin", 403, "FORBIDDEN");

  await User.findByIdAndDelete(req.params.id);
  return apiResponse.success(res, { deleted: true });
});

// Super admin: get blogs by a specific admin
export const getAdminBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.params.id }).sort({
    createdAt: -1,
  });
  return apiResponse.success(res, blogs);
});
