import { config as configDotenv } from "dotenv";
import { createClient } from "redis";

// Load environment variables
configDotenv();

// Set up Redis configuration based on environment
const getRedisConfig = () => {
  // For production environments, use environment variable
  if (process.env.REDIS_URL) {
    return {
      url: process.env.REDIS_URL,
    };
  }

  // For local development, fallback to localhost with retry strategy
  return {
    socket: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD || undefined,
    retry_strategy: (options) => {
      // Exponential backoff for retrying connection
      const retryDelayMs = Math.min(options.attempt * 100, 3000);
      return retryDelayMs;
    },
  };
};

// Create Redis client with configuration
const redisClient = createClient(getRedisConfig());

// Handle Redis connection events
redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

const connectToRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    if (process.env.NODE_ENV !== "production") {
      console.log("Running without Redis cache in development mode");
    }
  }
};

export { connectToRedis, redisClient };
