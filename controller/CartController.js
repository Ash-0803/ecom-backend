import { Cart } from "../model/Cart.js";

// Create a new cart
export const addToCart = async (req, res) => {
  try {
    const { product, user, quantity } = req.body;

    if (!product || !user || !quantity) {
      return res
        .status(400)
        .json({ message: "user, product, and quantity are required" });
      ``;
    }

    const existingCart = await Cart.findOne({ product, user });
    if (existingCart) {
      return res.status(400).json({ message: "Product already in cart" });
    }
    let newCart = new Cart({
      user,
      product,
      quantity,
    });
    const savedCart = await newCart.save();
    const doc = await Cart.findById(savedCart._id)
      .populate({
        path: "user",
        select: "-password", // Exclude the password field
      })
      .populate("product");

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch a cart by userId
export const fetchCart = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("fetchCart", req.params, userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const cart = await Cart.find({ user: userId })
      .populate({
        path: "user",
        select: "-password", // Exclude the password field
      })
      .populate("product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product from cart by itemId
export const deleteProductFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }
    const cart = await Cart.findByIdAndDelete(itemId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a cart by userId
export const updateCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(itemId, req.body);
    const cart = await Cart.findByIdAndUpdate(itemId, req.body, {
      new: true,
    })
      .populate({
        path: "user",
        select: "-password", // Exclude the password field
      })
      .populate("product");
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error updating cart in mongodb",
    });
  }
};
