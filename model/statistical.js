const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  nameCustomer: {
    type: String,
    ref: "Customers",
  },
  count: {
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
});

module.exports = mongoose.model("message", messageSchema);
