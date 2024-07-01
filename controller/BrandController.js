import { Brand } from "../model/Brand.js";
export const fetchAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch {
    res.status(500).json({
      error: error.message,
      message: "Error fetching brands from mongodb",
    });
  }
};
