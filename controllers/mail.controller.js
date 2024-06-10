const User = require("../models/user.model");
const nodemailer = require("nodemailer");

module.exports.index = async (req, res) => {
  try {
    const users = await User.find({});
    res.render("pages/mail/index", {
      pageTitle: "Mail Management",
      users: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error locking account: " + err.message);
  }
};

module.exports.lockAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { isLocked: true });
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error locking account: " + err.message);
  }
};

module.exports.unlockAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { isLocked: false });
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error unlocking account: " + err.message);
  }
};

module.exports.sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const userMailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Welcome to Our App!",
      text: "We are glad to have you.",
      html: "<strong>Hello, I am Trung Hieu</strong>",
    };
    await transporter.sendMail(userMailOptions);
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not send welcome email.");
  }
};

module.exports.lockAll = async (req, res) => {
  try {
    const arr = req.body.lockAll.split(",");
    await User.updateMany({ email: { $in: arr } }, { isLocked: true });
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error locking account: " + err.message);
  }
};

module.exports.unlockAll = async (req, res) => {
  try {
    const arr = req.body.unlockAll.split(",");
    await User.updateMany({ email: { $in: arr } }, { isLocked: false });
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error unlocking account: " + err.message);
  }
};
