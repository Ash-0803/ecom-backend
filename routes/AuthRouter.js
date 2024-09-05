import express from "express";
import { createUser, loginUser } from "../controller/AuthController.js";

export const authRouter = express.Router();

authRouter.post("/signup", createUser).post("/login", loginUser);
