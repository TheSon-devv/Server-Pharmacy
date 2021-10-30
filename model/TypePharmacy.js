const mongoose = require("mongoose");

const TypePharmacySchema = new mongoose.Schema({
  nameTypePharmacy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("typePharmacy", TypePharmacySchema);
