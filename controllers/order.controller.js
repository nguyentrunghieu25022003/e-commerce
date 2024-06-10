const User = require("../models/user.model");
const Order = require("../models/order.model");

module.exports.index = async (req, res) => {
  try {
    const orders = await Order.find({});
    let processCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;

    orders.forEach((order) => {
      switch (order.orderStatus) {
        case "Processing":
          processCount++;
          break;
        case "Shipped":
          shippedCount++;
          break;
        case "Delivered":
          deliveredCount++;
          break;
        case "Cancelled":
          cancelledCount++;
          break;
      }
    });
    res.render("pages/order-management/index", {
      pageTitle: "Order Management",
      processCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.processing = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "Processing" });
    res.render("pages/order-management/processing", {
      pageTitle: "Processing",
      orders: orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


module.exports.shipped = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findByIdAndUpdate(orderId, { orderStatus: "Shipped" });
    const orders = await Order.find({ orderStatus: "Shipped" });
    res.render("pages/order-management/shipped", {
      pageTitle: "Shipped",
      orders: orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.delivered = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "Delivered" });
    res.render("pages/order-management/delivered", {
      pageTitle: "Delivered",
      orders: orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports.cancelled = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findByIdAndUpdate(orderId, { orderStatus: "Cancelled" });
    const orders = await Order.find({ orderStatus: "Cancelled" });
    res.render("pages/order-management/cancelled", {
      pageTitle: "Cancelled",
      orders: orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
