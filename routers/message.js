const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../model/message");

router.get("/", async (req, res) => {
  try {
    const getMessage = await Message.find().populate("doctor", "nameDoctor");
    res.json({ message: "Success", code: 200, getMessage });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});
router.get("/:messageId", async (req, res) => {
  try {
    const getMessage = await Message.findById(req.params.messageId);
    let data = [];
    data.push(getMessage);
    res.json({ message: "Success", code: 200, data });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.post("/", async (req, res) => {
  const dataMessage = new Message({
    nameCustomer: req.body.nameCustomer,
    phone: req.body.phone,
    information: req.body.information,
    doctor: req.body.doctor,
    status: 0,
    address: req.body.address,
  });

  try {
    const saveMessage = await dataMessage.save();
    res.json({ message: "Success", code: 200, saveMessage });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
    console.log(err);
  }
});

router.delete("/:messageId", async (req, res) => {
  try {
    const getMessage = await Message.deleteOne({ _id: req.params.messageId });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.put("/:messageId", async (req, res) => {
  try {
    const updateMessage = await Message.updateOne(
      { _id: req.params.messageId },
      {
        $set: {
          nameCustomer: req.body.nameCustomer,
          phone: req.body.phone,
          information: req.body.information,
          doctor: req.body.doctor,
          status: req.body.status,
          address: req.body.address,
        },
      }
    );
    res.json({ message: "Success", code: 200 });
  } catch (error) {
    res.json({ message: "Error", code: 400 });
  }
});

module.exports = router;
