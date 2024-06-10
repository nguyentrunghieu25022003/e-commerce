const nodemailer = require("nodemailer");
const User = require("../models/user.model");

module.exports.index = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user.email : null;
    }
    res.render("pages/contact/index", {
      pageTitle: "Contact",
      users: user,
      userIds: userIds,
      cart: req.session.cart || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.sendContact = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  try {
    const { email } = req.body;
    const userMailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Thank you for your contribution",
      text: "Your contribution has been recognized by us.",
    };
    await transporter.sendMail(userMailOptions);
    res.redirect("/contact");
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).send("An error occurred while sending contact information.");
  }
};

