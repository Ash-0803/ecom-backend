import express from "express";
import {
  createProduct,
  fetchAllProductsByFilter,
  fetchProductById,
  updateProduct,
} from "../controller/ProductController.js";
const productRouter = express.Router();

productRouter
  .get("/", fetchAllProductsByFilter)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct)
  .post("/", createProduct);

export { productRouter };
