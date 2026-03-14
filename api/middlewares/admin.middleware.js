import CustomError from "../utils/customError.js";

export const requireAdmin = (req, _res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "superadmin")
  ) {
    if (req.user.suspended) {
      throw new CustomError("Your account has been suspended", 403);
    }
    return next();
  }
  throw new CustomError("Access denied - Admin only", 403);
};

export const requireSuperAdmin = (req, _res, next) => {
  if (req.user && req.user.role === "superadmin") {
    return next();
  }
  throw new CustomError("Access denied - Super Admin only", 403);
};

export default requireAdmin;
