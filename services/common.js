import mongoose from "mongoose";
import passport from "./passportConfig.js"; // Import from passportConfig

export function isAuth(req, res, next) {
  return passport.authenticate("jwt");
}

export const sanitizeUser = (user) => {
  return {
    id: user.id,
    role: user.role,
  };
};

// Connect to MongoDB
export async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

export function cookieExtractor(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
}
