import express from "express";
import {
  createUser,
  fetchUser,
  updateUser,
} from "../controller/UserController.js";
const userRouter = express.Router();
userRouter.put("", createUser).get("/:id", fetchUser).patch("/:id", updateUser);
