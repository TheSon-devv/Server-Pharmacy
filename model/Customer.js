const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  nameKH: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
    maxLength: 15,
  },
  address: {
    type: String,
  },
},{ timestamps: true });

module.exports = mongoose.model("Customers", customerSchema);
