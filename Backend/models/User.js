// MODEL : models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  role: { type: String, required: true, default: "admin" },
  verification: { type: Boolean, default: false },
  status: { type: Boolean, default: false },
  image: {
    type: Object,
    default: { url: "", publicId: null },
  },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

const User = mongoose.model("Admin", userSchema);
module.exports = User;