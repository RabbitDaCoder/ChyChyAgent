import { body, validationResult } from "express-validator";
import CustomError from "../utils/customError.js";

export const validateBlog = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("image").notEmpty().withMessage("Image URL is required"),
  body("tags").isArray().withMessage("Tags must be an array"),
  body("category").notEmpty().withMessage("Category is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return next(new CustomError(errorMessages.join(", "), 400));
    }
    next();
  },
];
