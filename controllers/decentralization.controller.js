const User = require("../models/user.model");

module.exports.index = async (req, res) => {
  try {
    const users = await User.find({});
    const countDocuments = await User.countDocuments({});
    res.render("pages/decentralization/index", {
      pageTitle: "Decentralization",
      users: users,
      countDocuments: countDocuments
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.handleRoles = async (req, res) => {
  try {
    const userIds = req.params.id;
    const currentRole = req.params.value;
    await User.findOneAndUpdate({ "_id": userIds }, { "role": currentRole });
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};