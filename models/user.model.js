const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: Number,
  gender: String,
  email: { type: String, required: true },
  phone: String,
  address: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  birthDate: String,
  role: { type: String, required: true },
  isLocked: { type: Boolean, required: true, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
