import express from "express";
import { fetchUser, updateUser } from "../controller/UserController.js";
import { cacheMiddleware, clearCache } from "../services/redisCache.js";

export const userRouter = express.Router();

// Cache user data for 5 minutes, with invalidation on update
userRouter
  .get("/own", cacheMiddleware(300, true), fetchUser) // true flag indicates user-specific caching
  .patch(
    "/",
    async (req, res, next) => {
      // Clear user's cache when they update their profile
      const userId = req.user.id;
      await clearCache(`user:${userId}:users`);
      next();
    },
    updateUser
  );
