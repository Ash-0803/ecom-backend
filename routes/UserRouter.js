import express from "express";
import { fetchUser, updateUser } from "../controller/UserController.js";
import { cacheMiddleware, clearCache } from "../services/redisCache.js";

export const userRouter = express.Router();

userRouter.get("/own", cacheMiddleware(300, true), fetchUser).patch(
  "/",
  async (req, res, next) => {
    const userId = req.user.id;
    await clearCache(`user:${userId}:users`);
    next();
  },
  updateUser
);
