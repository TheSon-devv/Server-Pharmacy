const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
  nameDoctor: {
    type: String,
  },
  workplace: {
    type: String,
  },
  experienceYear: {
    type: String,
  },
  experience: {
    type: String,
  },
  details: {
    type: String,
  },
  education: {
    type: String,
  },
  doctorImage: {
    type: String,
    required: true,
  },
},{ timestamps: true });

module.exports = mongoose.model("doctor", doctorSchema);
