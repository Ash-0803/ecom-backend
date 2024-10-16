import { User } from "../model/User.js";

export const fetchUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(
      id,
      "name email addresses role -_id"
    ).lean(); // lean method converts mongoose document to plain js objects so that we can delete user.id;
    delete user.id;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching product from mongodb",
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error updating User in mongodb",
    });
  }
};
