const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    nameLogin: {
      type: String,
      minLength: 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", userSchema);
