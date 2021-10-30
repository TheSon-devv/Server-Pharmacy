const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Checkout = require("../model/Checkout");
const Customer = require("../model/Customer");
const Pharmacy = require("../model/Pharmacy");
const Message = require("../model/message");
const verifyToken = require("./verifyToken");

router.get("/", async (req, res) => {
  try {
    const checkout = (await Checkout.find()).length;
    const customer = (await Customer.find()).length;
    const pharmacy = (await Pharmacy.find()).length;
    const totalMessage = (await Message.find()).length;
    res.json({
      message: "Success",
      code: 200,
      checkout,
      customer,
      pharmacy,
      totalMessage,
    });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

module.exports = router;
