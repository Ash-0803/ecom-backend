import express from "express";
import {
  addToCart,
  deleteProductFromCart,
  fetchCart,
  updateCart,
} from "../controller/CartController.js";
import { cacheMiddleware, clearCache } from "../services/redisCache.js";

export const cartRouter = express.Router();

// Cart data is user-specific and changes frequently, use short cache duration (60 seconds)
cartRouter
  .post(
    "/",
    async (req, res, next) => {
      // Clear user's cart cache when adding to cart
      const userId = req.user.id;
      await clearCache(`user:${userId}:cart`);
      next();
    },
    addToCart
  )
  .get("/", cacheMiddleware(60, true), fetchCart) // true flag indicates user-specific caching
  .delete(
    "/:itemId",
    async (req, res, next) => {
      // Clear user's cart cache when removing items
      const userId = req.user.id;
      await clearCache(`user:${userId}:cart`);
      next();
    },
    deleteProductFromCart
  )
  .patch(
    "/:itemId",
    async (req, res, next) => {
      // Clear user's cart cache when updating cart
      const userId = req.user.id;
      await clearCache(`user:${userId}:cart`);
      next();
    },
    updateCart
  );
