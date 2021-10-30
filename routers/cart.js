const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../model/Cart");
const verifyToken = require("./verifyToken");

router.get("/", async (req, res) => {
  try {
    const getCart = await Cart.find().sort({ dateCreate: -1 });
    res.json({ message: "Success", code: 200, getCart });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.get("/:userID", async (req, res) => {
  try {
    const getCart = await Cart.findOne({ userId: req.params.userID }).sort({
      dateCreate: -1,
    });
    res.json({ message: "Success", code: 200, getCart });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.post("/", async (req, res) => {
  const dataCart = new Cart({
    userId: req.body.userId,
    listCart: req.body.listCart,
    listCartPaypal: req.body.listCartPaypal,
    listCheckout: req.body.listCheckout,
    numberCart: req.body.listCart.length,
  });

  try {
    const maCart = await Cart.findOne({ _id: req.body._id });
    if (!maCart) {
      const saveCart = await dataCart.save();
      res.json({ message: "Success", code: 200, saveCart });
    } else {
      return res.json({ message: "Conflict !", code: 401 });
    }
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
    console.log(err);
  }
});

router.delete("/:cartId", async (req, res) => {
  try {
    const getCart = await Cart.deleteOne({ _id: req.params.cartId });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.put("/:cartId", async (req, res) => {
  try {
    const updateCart = await Cart.updateOne(
      { _id: req.params.cartId },
      {
        $set: {
          userId: req.body.userId,
          listCart: req.body.listCart,
          listCartPaypal: req.body.listCartPaypal,
          listCheckout: req.body.listCheckout,
          numberCart: req.body.numberCart,
        },
      }
    );
    res.json({ message: "Success", code: 200 });
  } catch (error) {
    res.json({ message: "Error", code: 400 });
  }
});

module.exports = router;
