const mongoose = require("mongoose");
const User = require("../models/user.model");

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Success");
  } catch (err) {
    console.error(err);
  }
};

module.exports.getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    console.error(err);
  }
};

module.exports.getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.error(err);
  }
};
