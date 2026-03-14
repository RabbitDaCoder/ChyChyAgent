import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// using redis to store the refresh token
export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) return null; // stop retrying after 3 attempts
    return Math.min(times * 500, 2000);
  },
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) =>
  console.error("Redis connection error:", err.message),
);
