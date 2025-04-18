import express from "express";
import { fetchAllBrands } from "../controller/BrandController.js";
import { cacheMiddleware } from "../services/redisCache.js";

export const brandRouter = express
  .Router()
  .get("/", cacheMiddleware(86400), fetchAllBrands);
