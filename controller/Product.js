import { Product } from "../model/Product.js";

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const doc = await product.save();
    console.log("creating product");
    res.status(201).json({ doc });
  } catch (error) {
    res.status(400).json({ error });
  }
};
