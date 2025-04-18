import express from "express";
import {
  addToCart,
  deleteProductFromCart,
  fetchCart,
  updateCart,
} from "../controller/CartController.js";
import { cacheMiddleware, clearCache } from "../services/redisCache.js";

export const cartRouter = express.Router();

cartRouter
  .post(
    "/",
    async (req, res, next) => {
      const userId = req.user.id;
      await clearCache(`user:${userId}:cart`);
      next();
    },
    addToCart
  )
  .get("/", cacheMiddleware(60, true), fetchCart)
  .delete(
    "/:itemId",
    async (req, res, next) => {
      const userId = req.user.id;
      await clearCache(`user:${userId}:cart`);
      next();
    },
    deleteProductFromCart
  )
  .patch(
    "/:itemId",
    async (req, res, next) => {
      const userId = req.user.id;
      await clearCache(`user:${userId}:cart`);
      next();
    },
    updateCart
  );
