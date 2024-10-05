import bcrypt from "bcrypt";
// we have used bcrypt for password hashing, we could have also used the crypto module from node.js, but bcrypt is more secure but slow whereas crypto is faster but less secure!
import { User } from "../model/User.js";
import { sanitizeUser } from "./services/common.js";

export const createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

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

    await user.save();

    req.login(sanitizeUser(user), (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      } else {
        return res.status(201).json(sanitizeUser(user));
      }
    });
    res.status(201).json(sanitizeUser(user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  res.json(req.user);
};
