import express from "express";
import { fetchUser, updateUser } from "../controller/UserController.js";

export const userRouter = express.Router();

userRouter.get("/:id", fetchUser).patch("/:id", updateUser);
