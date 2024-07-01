import express from "express";
import { fetchAllCategories } from "../controller/CategoryController.js";

export const categoryRouter = express.Router().get("/", fetchAllCategories);
