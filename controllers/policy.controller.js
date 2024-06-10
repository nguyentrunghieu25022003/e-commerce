const User = require("../models/user.model");

module.exports.index = async (req, res) => {
  let userIds = req.session.passport ? req.session.passport.user : null;
  let user;
  if (userIds) {
    user = await User.findOne({ _id: userIds });
    user = user ? user.email : null;
  }
  res.render("pages/policy/index", {
    pageTitle: "Policy",
    users: user,
    cart: req.session.cart || [],
  });
};
