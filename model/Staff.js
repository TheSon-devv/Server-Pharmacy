const mongoose = require("mongoose");

const staffSchema = mongoose.Schema({
  maNV: {
    type: String,
    required: true,
    maxLength: 10,
  },
  nameNV: {
    type: String,
    required: true,
    min: 6,
    maxLength: 10,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    maxLength: 11,
  },
  chucVu: {
    type: String,
  },
});

module.exports = mongoose.model("staff", staffSchema);
