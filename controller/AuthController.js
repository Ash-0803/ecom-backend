import bcrypt from "bcrypt";
import { User } from "../model/User.js";

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
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert the stored password buffer to a string
    const storedPassword = user.password.toString("utf-8");

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, storedPassword);

    if (isMatch) {
      return res.status(200).json({
        email: user.email,
        name: user.name,
        role: user.role,
        addresses: user.addresses,
      });
    } else {
      return res.status(401).json({ message: "wrong credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
