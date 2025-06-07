import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import CustomError from "../utils/customError.js";

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  throw new CustomError("Access denied - Admin Only", 403);
};

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No access token provided." });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ error: "Unauthorized - User not found." });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Unauthorized - Token expired. Please refresh your token.",
        });
      }

      return res
        .status(401)
        .json({ error: "Unauthorized - Invalid access token." });
    }
  } catch (error) {
    console.error("Error in protectedRoute middleware:", error.message);
    next(error); // Pass error to global error handler
  }
};
