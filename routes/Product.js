import express from "express";
import {
  createProduct,
  fetchAllProductsByFilter,
} from "../controller/Product.js";
const productRouter = express.Router();

productRouter.post("/", createProduct).get("/", fetchAllProductsByFilter);

export { productRouter };
