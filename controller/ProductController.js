import { Product } from "../model/Product.js";

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const doc = await product.save();
    console.log("creating product");
    res.status(201).json({ doc });
  } catch (error) {
    res
      .status(400)
      .json({ error }, { message: "Product could not be created" });
  }
};

export const fetchAllProductsByFilter = async (req, res) => {
  const {
    category,
    sort,
    order,
    color,
    brand,
    admin,
    _page = 1,
    _limit = 3,
  } = req.query;

  let sortObject = {};
  if (sort && order) {
    sortObject[sort] = order === "desc" ? -1 : 1;
  }
  let filterObject = {};
  if (!admin) {
    filterObject["deleted"] = { $ne: true };
  }
  if (category) filterObject.category = category;
  if (color) filterObject.color = color;
  if (brand) filterObject.brand = brand;

  let skip = (_page - 1) * _limit;

  try {
    const products = await Product.find(filterObject)
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(_limit));

    const totalProducts = await Product.countDocuments(filterObject);

    res.status(200).set("X-total-count", totalProducts).json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching products from mongodb",
    });
  }
};

export const fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching product from mongodb",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error updating product in mongodb",
    });
  }
};
