const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  nameCustomer: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  information: {
    type: String,
  },
  doctor: [
    {
      type: String,
      ref: "doctor",
    },
  ],
  status: {
    type: Number,
  },
  address: {
    type: String,
  },
});

module.exports = mongoose.model("message", messageSchema);
