import express from "express";
import {
  createOrder,
  deleteOrder,
  fetchAllOrders,
  fetchOrdersByUser,
  updateOrder,
} from "../controller/OrderController.js";
import { cacheMiddleware, clearCache } from "../services/redisCache.js";

export const orderRouter = express.Router();

orderRouter
  .get("/own", cacheMiddleware(300, true), fetchOrdersByUser) // User-specific caching with 5 minute TTL
  .get("/", cacheMiddleware(300, false), fetchAllOrders) // Global cache for admin access
  .post(
    "/",
    async (req, res, next) => {
      // Clear both global and user-specific order caches
      const userId = req.user.id;
      await clearCache(`user:${userId}:orders`); // Clear user's own orders cache
      await clearCache("orders"); // Clear global orders cache (for admins)
      next();
    },
    createOrder
  )
  .delete(
    "/:orderId",
    async (req, res, next) => {
      // Clear both global and user-specific order caches
      const userId = req.user.id;
      await clearCache(`user:${userId}:orders`);
      await clearCache("orders");
      next();
    },
    deleteOrder
  )
  .patch(
    "/:orderId",
    async (req, res, next) => {
      // Clear both global and user-specific order caches
      const userId = req.user.id;
      await clearCache(`user:${userId}:orders`);
      await clearCache("orders");
      next();
    },
    updateOrder
  );
