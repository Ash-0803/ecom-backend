import { Category } from "../model/Category.js";

export const fetchAllCategories = async (req, res) => {
  console.log("Fetching all categories");
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch(error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching categories from mongodb",
    });
  }
};
