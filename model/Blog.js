const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    nameBlog: {
      type: String,
      required: true,
    },
    dateCreate: {
      type: Date,
      default: Date.now,
    },
    information: {
      type: String,
      required: true,
    },
    adminCreate: [
      {
        type: String,
        ref: "Admin",
        required: true,
      },
    ],
    blogImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
