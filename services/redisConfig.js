import { createClient } from "redis";

// Create Redis client
const redisClient = createClient({
  // Default is localhost:6379, but you can customize these settings
  // url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Handle Redis connection events
redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

// Connect to Redis
const connectToRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

export { connectToRedis, redisClient };
