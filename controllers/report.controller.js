const User = require("../models/user.model");

module.exports.index = async (req, res) => {
  try {
    const users = await User.find({});
    res.render("pages/report/index", {
      pageTitle: "Report",
      users: users
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports.chat = async (req, res) => {
  try {
    const userIds = req.session.passport ? req.session.passport.user : null;
    const user = await User.findOne({ _id: req.params.id });
    res.render("pages/chat/index", {
      pageTitle: "Chat with user",
      user: user,
      userIds: userIds
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
