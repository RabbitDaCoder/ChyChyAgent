import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import CustomError from "../utils/customError.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const cookieToken = req.cookies?.accessToken;
    const token = bearerToken || cookieToken;

    if (!token) {
      throw new CustomError("Unauthorized - No access token provided.", 401);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new CustomError("Unauthorized - User not found.", 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new CustomError("Unauthorized - Token expired.", 401));
    }
    return next(error);
  }
};
