const express = require("express");
const mongoose = require("mongoose");
const Admin = require("../model/Admin");
const verifyToken = require("./verifyToken");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const getAdmin = await Admin.find();
    res.json({ message: "Success", code: 200, getAdmin });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.get("/:adminID", verifyToken, async (req, res) => {
  try {
    const getAdmin = await Admin.findById(req.params.adminID);
    res.json({ message: "Success", code: 200, getAdmin });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

// router.post('/',verifyToken, async (req, res) => {
//     const dataCustomer = new Customer({
//         nameKH: req.body.nameKH,
//         nameLogin: req.body.nameLogin,
//         password: req.body.password,
//         phoneNumber: req.body.phoneNumber
//     })
//     try {

//         const saveCustomer = await dataCustomer.save();
//         res.json({ message: 'Success', code: 200, saveCustomer })

//     } catch (err) {
//         res.status(400);
//         res.json({ message: 'Error', code: 400 })
//     }
// })

// router.delete('/:customerID', verifyToken, async (req, res) => {
//     try {
//         const getCustomer = await Customer.deleteOne({ _id: req.params.customerID });
//         res.json({ message: 'Success', code: 200 })
//     } catch (err) {
//         res.status(400);
//         res.json({ message: 'Error', code: 400 })
//     }
// })

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
