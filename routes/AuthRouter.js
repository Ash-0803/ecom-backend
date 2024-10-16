import express from "express";
import passport from "passport";
import {
  checkUser,
  createUser,
  loginUser,
} from "../controller/AuthController.js";

export const authRouter = express.Router();

authRouter
  .post("/signup", createUser)
  .get("/check", passport.authenticate("jwt"), checkUser)
  .post("/login", passport.authenticate("local"), loginUser);
