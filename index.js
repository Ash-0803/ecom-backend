import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { brandRouter } from "./routes/BrandRouter.js";
import { categoryRouter } from "./routes/CategoryRouter.js";
import { orderRouter } from "./routes/OrderRouter.js";
import { productRouter } from "./routes/ProductRouter.js";
configDotenv();
// const routes = require("./routes");

const PORT = process.env.PORT;
const app = express();

// middlewares
// this is a middleware that parses the request body and has a body parsern built in
app.use(
  cors({
    exposedHeaders: ["X-total-count"],
  })
);
app.use(express.json());
app.use("/products", productRouter);
app.use("/brands", brandRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}
connectToDB();

app.get("/", (req, res) => {
  res.json({ status: "success" });
});
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
