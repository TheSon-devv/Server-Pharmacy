const mongoose = require("mongoose");

const PharmacySchema = new mongoose.Schema({
  namePharmacy: {
    type: String,
    required: true,
  },
  typePharmacy: [
    {
      type: String,
      ref: "typePharmacy",
    },
  ],
  pricePharmacy: {
    type: String,
    required: true,
  },
  information: {
    type: String,
  },
  status: {
    type: String,
  },
  promotion: {
    type: String,
  },
  totalPromotion: {
    type: String,
  },
  pharmacyImage: {
    type: String,
  },
  dateCreate: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

module.exports = mongoose.model("pharmacy", PharmacySchema);
