import express from "express";
import { fetchAllCategories } from "../controller/CategoryController.js";
import { cacheMiddleware } from "../services/redisCache.js";

// Cache categories for 1 day (86400 seconds) as they rarely change
export const categoryRouter = express
  .Router()
  .get("/", cacheMiddleware(86400), fetchAllCategories);
