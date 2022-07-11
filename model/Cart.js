const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  listCart: [
    {
      _id: { type: String },
      namePharmacy: { type: String },
      pricePharmacy: { type: String },
      pharmacyImage: { type: String },
      promotion: { type: String },
      quantity: { type: Number },
    },
  ],
  listCartPaypal: [
    {
      name: { type: String },
      unit_amount: {
        currency_code: { type: String },
        value: { type: String },
      },
      quantity: { type: Number },
    },
  ],
  listCheckout: [
    {
      pharmacyId: { type: String },
    },
  ],
  numberCart: {
    type: Number,
  },
  dateCreate: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

module.exports = mongoose.model("cart", cartSchema);
