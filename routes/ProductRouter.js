import express from "express";
import {
  createProduct,
  fetchAllProductsByFilter,
  fetchProductById,
  updateProduct,
} from "../controller/ProductController.js";
import { cacheMiddleware, clearCache } from "../services/redisCache.js";
export const productRouter = express.Router();

productRouter
  .get("/", cacheMiddleware(3600), fetchAllProductsByFilter)
  .get("/:id", cacheMiddleware(3600), fetchProductById)
  .patch(
    "/:id",
    async (req, res, next) => {
      await clearCache("products");
      next();
    },
    updateProduct
  )
  .post(
    "/",
    async (req, res, next) => {
      await clearCache("products");
      next();
    },
    createProduct
  );
