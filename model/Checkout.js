const mongoose = require("mongoose");

const CheckoutSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  details: [
    {
      pharmacyId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "pharmacy",
          required: true,
        },
      ],
    },
  ],
  quantity: {
    type: Number,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  userId: [
    {
      type: String,
      ref: "Customers",
    },
  ],
  dateCreate: {
    type: Date,
    default: Date.now,
  },
  checkoutPaypal: {
    type: String,
  },
  nameCustomer: {
    type: String,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
},{ timestamps: true });

module.exports = mongoose.model("checkout", CheckoutSchema);
