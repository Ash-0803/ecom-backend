import express from "express";
import { createOrder, fetchAllOrders } from "../controller/OrderController.js";

export const orderRouter = express
  .Router()
  .get("/", fetchAllOrders)
  .post("/", createOrder);
