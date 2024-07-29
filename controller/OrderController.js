import { Order } from "../model/Order.js";

export const createOrder = async (req, res) => {
  console.log("Creating an order");
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error creating an order",
    });
  }
};

export const fetchAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching orders",
    });
  }
};
