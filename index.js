import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./routes/AuthRouter.js";
import { brandRouter } from "./routes/BrandRouter.js";
import { categoryRouter } from "./routes/CategoryRouter.js";
import { orderRouter } from "./routes/OrderRouter.js";
import { productRouter } from "./routes/ProductRouter.js";
import { userRouter } from "./routes/UserRouter.js";
configDotenv();
// const routes = require("./routes");

const PORT = process.env.PORT;
const app = express();

// middlewares
// this is a middleware that parses the request body and has a body parsern built in
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to match your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-total-count"],
    //credentials: true, // If you need to send cookies or other credentials
  })
);
app.use(express.json());
app.use("/products", productRouter);
app.use("/brands", brandRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

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
