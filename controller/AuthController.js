import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// we have used bcrypt for password hashing, we could have also used the crypto module from node.js, but bcrypt is more secure but slow whereas crypto is faster but less secure!
import { config as configDotenv } from "dotenv";
import { User } from "../model/User.js";
import { sanitizeUser } from "../services/common.js";

configDotenv();

export const createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert the hashed password to a Buffer
    const passwordBuffer = Buffer.from(hashedPassword);

    const user = new User({
      email,
      password: passwordBuffer,
      name,
      role,
    });

    req.logIn(sanitizeUser(user), (err) => {
      // this also calls serializer and adds to session(req.user)
      if (err) {
        return res.status(400).json({ message: err.message });
      } else {
        const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET);
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });

        res.status(201).json(req.user);
      }
    });

    await user.save(); // The user is still saved in the db even if the token is not created. since token creation is asynchronous, we need to use transaction to prevent it, but lets leave it for now.
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  res.cookie("jwt", req.user.token, {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(201).json(sanitizeUser(req.user));
};

export const checkUser = async (req, res) => {
  if (req.user) {
    res.status(201).json(req.user);
  } else {
    res.sendStatus(401);
  }
};
