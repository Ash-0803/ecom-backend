import User from "../model/User";

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const fetchUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, "name email address");
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
