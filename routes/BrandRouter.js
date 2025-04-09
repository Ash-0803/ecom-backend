import express from "express";
import { fetchAllBrands } from "../controller/BrandController.js";
import { cacheMiddleware } from "../services/redisCache.js";

// Cache brands for 1 day (86400 seconds) as they rarely change
export const brandRouter = express
  .Router()
  .get("/", cacheMiddleware(86400), fetchAllBrands);
