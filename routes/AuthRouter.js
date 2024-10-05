import express from "express";
import passport from "passport";
import { createUser, loginUser } from "../controller/AuthController.js";

export const authRouter = express.Router();

authRouter
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser);
