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
  .get("/own", cacheMiddleware(300, true), fetchOrdersByUser)
  .get("/", cacheMiddleware(300, false), fetchAllOrders)
  .post(
    "/",
    async (req, res, next) => {
      const userId = req.user.id;
      await clearCache(`user:${userId}:orders`);
      await clearCache("orders"); // Clear global orders cache (for admins)
      next();
    },
    createOrder
  )
  .delete(
    "/:orderId",
    async (req, res, next) => {
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
      const userId = req.user.id;
      await clearCache(`user:${userId}:orders`);
      await clearCache("orders");
      next();
    },
    updateOrder
  );
