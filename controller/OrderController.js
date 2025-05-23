import { Order } from "../model/Order.js";

export const createOrder = async (req, res) => {
  console.log("Creating an order");
  try {
    const { items, totalAmount, totalItems, paymentMethod, selectedAddress } =
      req.body;
    const userId = req.user.id;
    const orderBody = {
      user: userId,
      items,
      totalAmount,
      totalItems,
      paymentMethod,
      selectedAddress,
    };

    console.log(req.body);
    if (!items || !paymentMethod || !selectedAddress) {
      return res.status(400).json({
        message:
          "items,totalAmount,totalItems,paymentMethod,selectedAddress are required",
      });
    }

    const existingOrder = await Order.findOne(orderBody);
    // TODO: we need to prompt the user to ask whether they want to still create the new order or not. If they want to make the same order again, we can create a new order with the same details. For now, we will just return a 409 error.
    if (existingOrder) {
      return res.status(409).json({
        message: "Order already exists",
      });
    }

    const order = new Order(orderBody);

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
    const userId = req.user.id;
    const orders = await Order.find({ user: userId });
    console.log("fetching orders", userId);
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
  console.log("updating order", orderId);
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
