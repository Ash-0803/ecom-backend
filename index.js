import cors from "cors";
import { config as configDotenv } from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "./passportConfig.js";
import { authRouter } from "./routes/AuthRouter.js";
import { brandRouter } from "./routes/BrandRouter.js";
import { cartRouter } from "./routes/CartRouter.js";
import { categoryRouter } from "./routes/CategoryRouter.js";
import { orderRouter } from "./routes/OrderRouter.js";
import { productRouter } from "./routes/ProductRouter.js";
import { userRouter } from "./routes/UserRouter.js";
import { isAuth } from "./controller/services/common.js";

configDotenv();
const PORT = process.env.PORT;
const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to match your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-total-count"],
    //credentials: true, // If you need to send cookies or other credentials
  })
);

console.log(process.env.SESSION_SECRET);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

app.use("/products", isAuth, productRouter); // we will use jwt token later instead of isAuth
app.use("/brands", brandRouter);
app.use("/categories", categoryRouter);
app.use("/orders", isAuth, orderRouter);
app.use("/users", isAuth, userRouter);
app.use("/auth", authRouter);
app.use("/cart", isAuth, cartRouter);

// Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
