const express = require("express");
const mongoose = require("mongoose");
const Pharmacy = require("../model/Pharmacy");
const TypePharmacy = require("../model/TypePharmacy");
const verifyToken = require("./verifyToken");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const getTypePharmacy = await TypePharmacy.find();
    const getSumTypePharmacy = await Pharmacy.aggregate([
      {
        $group: {
          _id: "$typePharmacy",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json({
      message: "Success",
      code: 200,
      getTypePharmacy,
      getSumTypePharmacy,
    });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.get("/:typePharmacyID", async (req, res) => {
  try {
    const getTypePharmacy = await Pharmacy.find({
      typePharmacy: req.params.typePharmacyID,
    });

    res.json({ message: "Success", code: 200, getTypePharmacy });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const dataTypePharmacy = new TypePharmacy({
    nameTypePharmacy: req.body.nameTypePharmacy,
  });
  try {
    const saveTypePharmacy = await dataTypePharmacy.save();
    res.json({ message: "Success", code: 200, saveTypePharmacy });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.delete("/:typePharmacyID", verifyToken, async (req, res) => {
  try {
    const getTypePharmacy = await TypePharmacy.deleteOne({
      _id: req.params.typePharmacyID,
    });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

// router.put('/:customerID', async (req, res) => {
//     try {
//         const updateCustomer = await Customer.findByIdAndUpdate(
//             req.params.customerID,
//             {
//                 $set: {
//                     nameKH: req.body.nameKH,
//                     nameLogin: req.body.nameLogin,
//                     password: req.body.password,
//                     phoneNumber: req.body.phoneNumber
//                 }
//             },
//             {
//                 new: true
//             }
//         );
//         res.json({ message: 'Success', code: 200 })
//     } catch (error) {
//         res.json({ message: 'Error', code: 400 })
//     }
// })

module.exports = router;
