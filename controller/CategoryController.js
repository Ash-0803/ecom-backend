import Category from "../model/Category.js";
export const fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch {
    res.status(500).json({
      error: error.message,
      message: "Error fetching categories from mongodb",
    });
  }
};
