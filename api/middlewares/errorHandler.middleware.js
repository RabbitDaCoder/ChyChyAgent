import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, _next) => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  // Custom app errors
  if (err instanceof AppError || err.statusCode) {
    const status = err.statusCode || 500;
    const code = err.code || "SERVER_ERROR";
    return apiResponse.error(res, err.message, code, status);
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    return apiResponse.error(
      res,
      `Invalid ${err.path}: ${err.value}`,
      "VALIDATION_ERROR",
      400,
    );
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return apiResponse.error(res, messages, "VALIDATION_ERROR", 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return apiResponse.error(
      res,
      `Duplicate value for ${field}`,
      "DUPLICATE_ERROR",
      409,
    );
  }

  return apiResponse.error(
    res,
    err.message || "Internal Server Error",
    "SERVER_ERROR",
    500,
  );
};

export default errorHandler;
