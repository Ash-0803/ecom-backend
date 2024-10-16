// passportConfig.js
import bcrypt from "bcrypt";
import { config as configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../model/User.js"; // Adjust the path as necessary
import { cookieExtractor, sanitizeUser } from "./common.js";
configDotenv();

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};
// Passport Strategies

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ _id: jwt_payload.id }, "id role");
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done({ status: "failed, user not found" }, false);
      }
    } catch (error) {
      return done(error, false);
      // or you could create a new account
    }
  })
);

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email }).exec();
        if (!user)
          return done(null, false, { message: "Incorrect credentials" });

        // Convert the stored password buffer to a string
        const storedPassword = user.password.toString("utf-8");
        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, storedPassword);

        if (!isMatch) {
          return done(null, false, { message: "Incorrect credentials" });
        }
        const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET);

        return done(null, { ...sanitizeUser(user), token }); // this line sends to serializeUser
      } catch (error) {
        return done(error);
      }
    }
  )
);

// creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// changes session variable req.user when called from authorized user
passport.deserializeUser(async function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export default passport;
