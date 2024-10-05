// passportConfig.js
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { sanitizeUser } from "./controller/services/common.js";
import { User } from "./model/User.js"; // Adjust the path as necessary

// Passport Strategies
passport.use(
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
        return done(null, user); // this line sends to serializeUser
      } catch (err) {
        return done(err);
      }
    }
  )
);

// creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, sanitizeUser(user));
  });
});

// changes session variable req.user when called from authorized user
passport.deserializeUser(async function (user, cb) {
  console.log("deserializer", user);

  process.nextTick(function () {
    return cb(null, user);
  });
});

export default passport;
