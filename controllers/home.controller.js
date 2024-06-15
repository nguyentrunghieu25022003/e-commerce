const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

module.exports.index = async (req, res) => {
  try {
    let userIds = req.session.passport ? req.session.passport.user : null;
    let user;
    if (userIds) {
      user = await User.findOne({ _id: userIds });
      user = user ? user.email : null;
    }
    res.render("pages/home/index", {
      pageTitle: "Home",
      users: user,
      cart: req.session.cart || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.register = async (req, res) => {
  res.render("pages/register/index", {
    pageTitle: "Register",
  });
};

module.exports.handleRegister = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      address,
      email,
      phone,
      username,
      password,
      birthDate,
    } = req.body;

    const errors = [];
    if (password.length < 6) {
      errors.push({ message: "Password must be at least 6 characters!" });
    }

    if (errors.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = "admin";
      const data = {
        firstName,
        lastName,
        age,
        gender,
        address,
        email,
        phone,
        username,
        password: hashedPassword,
        birthDate,
        role,
      };
      const user = new User(data);
      await user.save();
      res.redirect("/login");
    } else {
      res.status(400).json({ errors });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.login = async (req, res) => {
  res.render("pages/login/index", {
    pageTitle: "Login",
  });
};

module.exports.logout = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};