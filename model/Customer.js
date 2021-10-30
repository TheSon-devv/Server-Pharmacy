const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  nameKH: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    maxLength: 11,
  },
});

module.exports = mongoose.model("Customers", customerSchema);
