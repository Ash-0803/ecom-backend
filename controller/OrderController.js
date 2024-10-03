import { Order } from "../model/Order.js";

export const createOrder = async (req, res) => {
  console.log("Creating an order");
  try {
    const {
      items,
      totalAmount,
      totalItems,
      user,
      paymentMethod,
      selectedAddress,
    } = req.body;
    console.log(req.body);
    // Validate request body
    if (!items || !user || !paymentMethod || !selectedAddress) {
      return res.status(400).json({
        message:
          "items,totalAmount,totalItems,user,paymentMethod,selectedAddress are required",
      });
    }

    // Check if the order already exists
    const existingOrder = await Order.findOne({
      items,
      totalAmount,
      totalItems,
      user,
      paymentMethod,
      selectedAddress,
    });

    if (existingOrder) {
      return res.status(409).json({
        message: "Order already exists",
      });
    }

    // Create the order
    const order = new Order(req.body);

    // Save the order
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error creating an order",
    });
  }
};

export const fetchOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching orders",
    });
  }
};

export const fetchAllOrders = async (req, res) => {
  const {
    category,
    _sort,
    _order,
    color,
    brand,
    _page = 1,
    _limit = 3,
  } = req.query;

  let sortObject = {};
  if (_sort && _order) {
    sortObject[_sort] = _order === "desc" ? -1 : 1;
  }

  let filterObject = { deleted: { $ne: true } };
  if (category) filterObject.category = category;
  if (color) filterObject.color = color;
  if (brand) filterObject.brand = brand;

  let skip = (_page - 1) * _limit;

  try {
    const allOrders = await Order.find(filterObject)
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(_limit))
      .populate({
        path: "user",
        select: "-password -addresses", // Exclude the password and address field
      });

    const totalOrders = await Order.countDocuments(filterObject);

    res.status(200).set("X-total-count", totalOrders).json(allOrders);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error fetching allOrders from mongodb",
    });
  }
};
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID and delete it
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error deleting the order",
    });
  }
};
export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId);
  try {
    const order = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    });
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error updating order in mongodb",
    });
  }
};
