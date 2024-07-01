import express from "express";
import { fetchAllBrands } from "../controller/BrandController.js";
export const brandRouter = express.Router();
brandRouter.get("/", fetchAllBrands);