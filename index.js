import { configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { createProduct } from "./controller/Product.js";
configDotenv();
// const routes = require("./routes");

const PORT = process.env.PORT;
const app = express();

// middlewares
app.use(express.json());

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}
connectToDB();

app.post("/product", (req, res) => {
  createProduct(req, res);
  console.log("post request made", req.body.title);
});
app.get("/", (req, res) => {
  res.json({ status: "success" });
});
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
