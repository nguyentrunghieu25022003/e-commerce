const nodemailer = require("nodemailer");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

module.exports.index = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user.email : null;
    }
    if (!req.session.cart) {
      req.session.cart = [];
    }
    const productIds = req.session.cart.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });
    const updatedCart = req.session.cart.map((cartItem) => {
      const product = products.find((p) => p._id.toString() === cartItem._id);
      return {
        ...product.toObject(),
        quantity: cartItem.quantity,
      };
    });
    req.session.cart = updatedCart;
    res.render("pages/cart/index", {
      pageTitle: "Cart",
      cart: req.session.cart,
      users: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = req.session.cart || [];
    const existingItemIndex = cart.findIndex((item) => item._id === productId);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ _id: productId, quantity: 1 });
    }
    req.session.cart = cart;
    req.flash("success", "Product added to cart!");
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = req.session.cart || [];
    const updatedCart = cart.filter((item) => item._id !== productId);
    req.session.cart = updatedCart;
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.deleteSelected = async (req, res) => {
  try {
    const productIds = req.body.checkedProducts || [];
    const cart = req.session.cart || [];
    const updatedCart = cart.filter((item) => !productIds.includes(item._id));
    req.session.cart = updatedCart;
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.increaseQuantity = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = req.session.cart || [];
    const existingItemIndex = cart.findIndex((item) => item._id === productId);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    }
    req.session.cart = cart;
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


module.exports.decreaseQuantity = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = req.session.cart || [];
    const existingItemIndex = cart.findIndex((item) => item._id === productId);
    if (existingItemIndex !== -1) {
      if (cart[existingItemIndex].quantity > 1) {
        cart[existingItemIndex].quantity -= 1;
      } else {
        cart.splice(existingItemIndex, 1);
      }
    }
    req.session.cart = cart;
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.payProducts = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    const productList = JSON.parse(req.body.productList);
    let orderItemsPromises = productList.map(async (item) => {
      const product = await Product.findById(item.id);
      let total = parseFloat(product.price * item.quantity);
      return {
        productId: product._id,
        name: product.title,
        thumbnail: product.thumbnail,
        price: Number(product.price),
        quantity: Number(item.quantity),
        total: total,
      };
    });
    if (Array.from(orderItemsPromises).length > 0) {
      const user = await User.findOne({ _id: userIds });
      const orderItems = await Promise.all(orderItemsPromises);
      const totalPrice = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const order = new Order({
        user: {
          _id: userIds,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        orderItems: orderItems,
        totalPrice: Number(totalPrice),
        shippingAddress: user.address,
      });
      await order.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      const userMailOptions = {
        from: process.env.MAIL_USERNAME,
        to: `${user.email}`,
        subject: "Order Success!",
        text: "We thank you for your trust and are pleased to serve you.",
      };
      await transporter.sendMail(userMailOptions);
      req.session.cart = null;
      res.redirect("/cart");
    } else {
      res.status(500).send("Need at least one product in the cart!");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.viewCart = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user.email : null;
    }
    const orders = await Order.find({ "user._id": userIds });
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
    res.render("pages/cart/order", {
      pageTitle: "My Order",
      users: user,
      processCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      cart: req.session.cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.processing = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user.email : null;
    }
    const orders = await Order.find({ orderStatus: "Processing" });
    const myMap = orders.filter((order) => order.user.email === user);
    res.render("pages/cart/processing", {
      pageTitle: "Processing",
      orders: myMap,
      users: user,
      cart: req.session.cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.shipped = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findOneAndUpdate({ _id: orderId }, { orderStatus: "Shipped" });
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user.email : null;
    }
    const orders = await Order.find({ orderStatus: "Shipped" });
    const myMap = orders.filter((order) => order.user.email === user);
    res.render("pages/cart/shipped", {
      pageTitle: "Shipped",
      orders: myMap,
      cart: req.session.cart,
      users: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.delivered = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user.email : null;
    }
    const orders = await Order.find({ orderStatus: "Delivered" });
    const myMap = orders.filter((order) => order.user.email === user);
    res.render("pages/cart/delivered", {
      pageTitle: "Delivered",
      cart: req.session.cart,
      orders: myMap,
      users: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.cancelled = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findOneAndUpdate(
      { _id: orderId },
      { orderStatus: "Cancelled" }
    );
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user.email : null;
    }
    const orders = await Order.find({ orderStatus: "Cancelled" });
    const myMap = orders.filter((order) => order.user.email === user);
    res.render("pages/cart/cancelled", {
      pageTitle: "Cancelled",
      orders: myMap,
      cart: req.session.cart,
      users: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

