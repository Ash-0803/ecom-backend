import cookieParser from "cookie-parser";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import express from "express";
import session from "express-session";
import { authRouter } from "./routes/AuthRouter.js";
import { brandRouter } from "./routes/BrandRouter.js";
import { cartRouter } from "./routes/CartRouter.js";
import { categoryRouter } from "./routes/CategoryRouter.js";
import { orderRouter } from "./routes/OrderRouter.js";
import { productRouter } from "./routes/ProductRouter.js";
import { userRouter } from "./routes/UserRouter.js";
import { connectToDB, isAuth } from "./services/common.js";
import passport from "./services/passportConfig.js";

configDotenv();

const PORT = process.env.PORT;
const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://thehavenstore.vercel.app"], // Adjust this to match your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-total-count"],
    credentials: true, // If you need to send cookies or other credentials
  })
);

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.use("/products", productRouter);
app.use("/brands", brandRouter);
app.use("/categories", categoryRouter);
app.use("/orders", isAuth(), orderRouter);
app.use("/users", isAuth(), userRouter);
app.use("/auth", authRouter);
app.use("/cart", isAuth(), cartRouter);

connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
