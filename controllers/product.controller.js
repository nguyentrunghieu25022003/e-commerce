const Product = require("../models/product.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");

module.exports.index = async (req, res) => {
  try {
    const userIds = req.session.passport ? req.session.passport.user : null;
    let user;

    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user._doc.email : null;
    }

    const find = {};
    let keyword = "";
    const objectPagination = {
      limitItems: 8,
      currentPages: req.query.page ? parseInt(req.query.page) : 1,
    };

    if (req.query.search) {
      keyword = req.query.search;
      const reg = new RegExp(keyword, "i");
      find.title = { $regex: reg };
    }

    if (objectPagination.currentPages < 1) {
      objectPagination.currentPages = 1;
    }

    if (req.query.category) {
      find.category = req.query.category;
    }

    objectPagination.skip = (objectPagination.currentPages - 1) * objectPagination.limitItems;
    const countProducts = await Product.countDocuments(find);
    const totalPages = Math.ceil(countProducts / objectPagination.limitItems);
    objectPagination.totalPages = totalPages;

    const sortKey = req.query.sortKey || "title";
    const sortValue = req.query.sortValue || "increase";
    const sortDirection = sortValue === "decrease" ? -1 : 1;
    const sortCondition = { [sortKey]: sortDirection };

    const products = await Product.find(find)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .sort(sortCondition);

    const uniqueCategories = await Product.distinct("category");

    res.render("pages/product/index", {
      pageTitle: "Home",
      products: products,
      pagination: objectPagination,
      users: user,
      uniqueCategories: uniqueCategories,
      cart: req.session.cart || [],
    });
  } catch (err) {
    res.status(500).send("Error !: " + err.message);
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user._doc.email : null;
    }
    const productIds = req.params.id;
    const product = await Product.findOne({ _id: productIds });
    const comments = await Comment.find({ 'product._id': productIds }).populate('user', 'email');
    const countComments = await Comment.countDocuments({ 'product._id': productIds }).populate('user', 'email');
    res.render("pages/product/detail", {
      pageTitle: "Product Detail",
      users: user,
      product: product,
      comments: comments,
      countComments: countComments,
      cart: req.session.cart || []
    });
  } catch (err) {
    res.status(500).send("Error !: " + err.message);
  }
};

module.exports.createComment = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user._doc : null;
    }
    const productId = req.params.id || null;
    const data = {
      text: req.body.text || "This comment does not exist or has been deleted",
      user: {
        _id: user._id,
        email: user.email
      },
      product: {
        _id: productId
      }
    }
    const comment = new Comment(data);
    await comment.save();
    res.redirect("back");
  } catch (err) {
    res.status(500).send("Error !: " + err.message);
  }
}

module.exports.deleteComment = async (req, res) => {
  try {
    const commentIds = req.params.commentId;
    await Comment.deleteOne({ _id: commentIds });
    res.redirect("back");
  } catch (err) {
    res.status(500).send("Error !: " + err.message);
  }
}

module.exports.addToCart = async (req, res) => {
  try {
    const productIds = req.params.id;
    const quantity = req.params.quantity;
    const cart = req.session.cart || [];
    const existingItemIndex = cart.findIndex((item) => item._id === productIds);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += parseInt(quantity, 10);
    } else {
      cart.push({ _id: productIds, quantity: parseInt(quantity, 10) });
    }
    res.redirect("back");
  } catch (err) {
    res.status(500).send("Error !: " + err.message);
  }
}