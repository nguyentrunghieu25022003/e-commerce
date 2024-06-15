const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

module.exports.index = async (req, res) => {
  res.render("pages/password/index", {
    pageTitle: "Forgot Password",
  });
};

module.exports.handlePassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await User.findOne({ email: email });
    if (!result) {
      res.redirect("back");
    }
    req.session.email = email;
    const code = Math.floor(1000 + Math.random() * 9000);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    req.session.code = code;
    const userMailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Confirm Your Email",
      text: `You have submitted a request to reset your password. Please do not share this code with anyone. Verification code is ${code}`,
    };
    await transporter.sendMail(userMailOptions);
    res.redirect("/forgot-password/confirm");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports.confirmEmail = async (req, res) => {
  res.render("pages/password/confirm", {
    pageTitle: "Confirm Email",
  });
};

module.exports.handleCode = async (req, res) => {
  try {
    const code = req.session.code;
    if(code == req.body.code) {
      res.redirect("/forgot-password/new-password");
    } else {
      res.redirect("back");
    }
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
}

module.exports.newPassword = async (req, res) => {
  res.render("pages/password/new-password", {
    pageTitle: "New Password",
  });
};

module.exports.updatePassword = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    if(req.session.email) {
      await User.findOneAndUpdate({ email: req.session.email }, { password: hashedPassword });
      res.redirect("/login");
    }
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
}