const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pharmacy = require("../model/Pharmacy");
const Checkout = require("../model/Checkout");
const verifyToken = require("./verifyToken");
const Customer = require("../model/Customer");

router.get("/", async (req, res) => {
  try {
    const getCheckout = await Checkout.find()
      .populate("details.pharmacyId")
      .populate("userId", "email")
      .sort({ dateCreate: -1 });
    const getTotalPriceDay = await Checkout.aggregate([
      {
        $group: {
          _id: { $dayOfYear: "$dateCreate" },
          totalAmount: { $sum: { $multiply: ["$totalPrice", "$quantity"] } },
          count: { $sum: 1 },
        },
      },
    ]).sort({ _id: 1 });
    res.json({ message: "Success", code: 200, getCheckout, getTotalPriceDay });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
    console.log(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    if (req.params.userId) {
      const getCheckout = await Checkout.find({ userId: req.params.userId })
        .populate("details.pharmacyId")
        .sort({ dateCreate: -1 });
      const getStatistical = await Checkout.aggregate([
        { $group: { _id: "userId", count: { $sum: 1 } } },
      ]);
      res.json({ message: "Success", code: 200, getCheckout });
    }
    // else {
    //     const getCheckout = await Checkout.find({ userIdFB: req.params.userIdFB }).populate('details.pharmacyId').sort({ dateCreate: -1 })
    //     res.json({ message: 'Success', code: 200, getCheckout })
    // }
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.post("/", async (req, res) => {
  const dataCheckout = new Checkout({
    _id: mongoose.Types.ObjectId(),
    details: req.body.details,
    quantity: req.body.quantity,
    checkoutPaypal: req.body.checkoutPaypal,
    totalPrice: req.body.totalPrice,
    userId: req.body.userId,
    nameCustomer: req.body.nameCustomer,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  });

  try {
    const saveCheckout = await dataCheckout.save();
    res.status(200).json({ message: "Success", code: 200, saveCheckout });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
    console.log(err);
  }
});

router.delete("/:checkoutID", verifyToken, async (req, res) => {
  try {
    const getCheckout = await Checkout.deleteOne({
      _id: req.params.checkoutID,
    });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

// router.put('/:pharmacyID', async (req, res) => {
//     try {
//         const updatePharmacy = await Pharmacy.updateOne(
//             { _id: req.params.pharmacyID },
//             {
//                 $set: {
//                     maFood: req.body.maFood,
//                     nameFood: req.body.tenFood,
//                     priceFood: req.body.priceFood,
//                     infomation: req.body.infomation,
//                 }
//             }
//         );
//         res.json({ message: 'Success', code: 200 })
//     } catch (error) {
//         res.json({ message: 'Error', code: 400 })
//     }
// })

module.exports = router;
