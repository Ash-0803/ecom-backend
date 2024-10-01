import express from "express";
import {
  createOrder,
  deleteOrder,
  fetchAllOrders,
  fetchOrdersByUser,
} from "../controller/OrderController.js";

export const orderRouter = express.Router();

orderRouter
  .get("/:userId", fetchOrdersByUser)
  .get("/", fetchAllOrders)
  .post("/", createOrder)
  .delete("/:orderId", deleteOrder);
