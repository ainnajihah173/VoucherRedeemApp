const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    points: { type: Number, default: 1000 },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
