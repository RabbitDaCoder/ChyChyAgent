import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./libs/db.js";

// Routes
import authRoute from "./routes/auth.routes.js";
import blogRoute from "./routes/blog.routes.js";
import listingRoute from "./routes/listing.routes.js";
import insuranceRoute from "./routes/insurance.routes.js";
import aiRoute from "./routes/ai.routes.js";
import contactRoute from "./routes/contact.routes.js";
import adminRoute from "./routes/admin.routes.js";
import sitemapRoute from "./routes/sitemap.routes.js";

import errorHandler from "./middlewares/errorHandler.middleware.js";

dotenv.config();

const app = express();

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      message: "Too many AI requests. Wait a moment.",
      code: "AI_RATE_LIMITED",
    },
  },
});

app.use(helmet());
app.use(morgan("dev"));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// Routes
app.use("/", sitemapRoute);
app.use("/api/v1/auth", authLimiter, authRoute);
app.use("/api/v1/blogs", blogRoute);
app.use("/api/v1/listings", listingRoute);
app.use("/api/v1/insurance", insuranceRoute);
app.use("/api/v1/ai", aiLimiter, aiRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/admins", adminRoute);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
