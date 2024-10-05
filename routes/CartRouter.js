import express from "express";
import {
  addToCart,
  deleteProductFromCart,
  fetchCart,
  updateCart,
} from "../controller/CartController.js";

export const cartRouter = express.Router();

// Route to create a new cart
cartRouter
  .post("/", addToCart)
  .get("/:userId", fetchCart)
  .delete("/:itemId", deleteProductFromCart)
  .patch("/:itemId", updateCart);
