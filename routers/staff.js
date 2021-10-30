const express = require("express");
const mongoose = require("mongoose");
const Staff = require("../model/Staff");
const verifyToken = require("./verifyToken");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const getStaff = await Staff.find();
    res.json({ message: "Success", code: 200, getStaff });
  } catch (err) {
    // res.status(400);
    // res.json({ message: 'Error', code: 400 })
    console.log(err);
  }
});

router.get("/:staffID", verifyToken, async (req, res) => {
  try {
    const getStaff = await Staff.findById(req.params.staffID);
    res.json({ message: "Success", code: 200, getStaff });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const dataStaff = new Staff({
    maNV: req.body.maNV,
    nameNV: req.body.nameNV,
    dateStart: req.body.dateStart,
    phoneNumber: req.body.phoneNumber,
    chucVu: req.body.chucVu,
  });
  try {
    const maStaffOnly = await Staff.findOne({ maNV: req.body.maNV });
    if (!maStaffOnly) {
      const saveStaff = await dataStaff.save();
      res.json({ message: "Success", code: 200, saveStaff });
    } else {
      return res.json({ message: "Error", code: 401 });
    }
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.delete("/:staffID", verifyToken, async (req, res) => {
  try {
    const getStaff = await Staff.deleteOne({ _id: req.params.staffID });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.put("/:staffID", async (req, res) => {
  try {
    const updateStaff = await Staff.updateOne(
      { _id: req.params.staffID },
      {
        $set: {
          maNV: req.body.maNV,
          nameNV: req.body.nameNV,
          dateStart: req.body.dateStart,
          phoneNumber: req.body.phoneNumber,
          chucVu: req.body.chucVu,
        },
      }
    );
    res.json({ message: "Success", code: 200 });
  } catch (error) {
    res.json({ message: "Error", code: 400 });
  }
});

module.exports = router;
