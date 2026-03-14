import User from "../models/User.model.js";
import CustomError from "../utils/customError.js";
import cloudinary from "../libs/cloudinary.js";
import generateTokens from "../utils/generateToken.js";
import storeRefreshToken from "../utils/storeRefreshToken.js";
import { redis } from "../libs/redis.js";
import jwt from "jsonwebtoken";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

export const register = async (req, res, next) => {
  const { email, password, name, adminKey } = req.body;
  try {
    if (
      process.env.ADMIN_SETUP_KEY &&
      adminKey !== process.env.ADMIN_SETUP_KEY
    ) {
      throw new AppError("Invalid admin setup key", 403, "FORBIDDEN");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new CustomError("User already exists", 400);
    }

    const user = await User.create({
      email,
      password,
      name,
      role: "admin",
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return apiResponse.success(res, { user, accessToken }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new CustomError("Invalid Credentials", 401);
    }

    if (user.suspended) {
      throw new CustomError(
        "Your account has been suspended. Contact super admin.",
        403,
      );
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.name);
    await storeRefreshToken(user._id, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return apiResponse.success(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const useOauth = async (req, res, next) => {
  try {
    // Generate JWT tokens for your app
    const { accessToken, refreshToken } = generateTokens(
      req.user._id,
      req.user.name,
    );
    await storeRefreshToken(req.user._id, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Redirect to your frontend with a success message or token
    res.redirect(`${process.env.CLIENT_URL}/admin/dashboard`);
  } catch (error) {
    console.log("Error in useOauth controller", error.message);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decode.userId}`);
    }

    // ✅ Ensure both tokens are removed
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return apiResponse.success(res, { message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    return apiResponse.success(res, req.user);
  } catch (error) {
    console.log("Error in getProfile controller", error.message);
    next(error);
  }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("No image file uploaded", 400);
    }

    // Convert image to base64
    const base64Image = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "chychyUsers_images",
    });

    // Get the logged-in user ID
    const userId = req.user._id;

    // Update the user's profile image in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { image: cloudinaryResponse.secure_url },
      { new: true },
    );

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return apiResponse.success(res, {
      message: "Profile image updated successfully",
      image: user.image,
    });
  } catch (error) {
    console.error("Error in uploadProfileImage:", error.message);
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new CustomError("No refresh token provided", 401);
    }
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storeToken = await redis.get(`refresh_token:${decode.userId}`);

    if (storeToken !== refreshToken) {
      throw new CustomError("Invalid refresh token", 401);
    }

    const accessToken = jwt.sign(
      { userId: decode.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // prevent xss attacks cross site scripting (xss attack)
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // prevent csrf attacks  cross site request forgery (csrf attack)
      maxAge: 30 * 60 * 1000, // 30 minutes
    });
    return apiResponse.success(res, {
      accessToken,
    });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    next(error);
  }
};
