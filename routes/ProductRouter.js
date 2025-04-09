import express from "express";
import {
  createProduct,
  fetchAllProductsByFilter,
  fetchProductById,
  updateProduct,
} from "../controller/ProductController.js";
import { cacheMiddleware, clearCache } from "../services/redisCache.js";
export const productRouter = express.Router();

// Apply caching middleware to GET routes (1 hour cache)
productRouter
  .get("/", cacheMiddleware(3600), fetchAllProductsByFilter)
  .get("/:id", cacheMiddleware(3600), fetchProductById)
  .patch(
    "/:id",
    async (req, res, next) => {
      // Clear product caches when a product is updated
      await clearCache("products");
      next();
    },
    updateProduct
  )
  .post(
    "/",
    async (req, res, next) => {
      // Clear product caches when a new product is added
      await clearCache("products");
      next();
    },
    createProduct
  );
