const express = require("express");
const mongoose = require("mongoose");
const Pharmacy = require("../model/Pharmacy");
const TypePharmacy = require("../model/TypePharmacy");
const verifyToken = require("./verifyToken");

const router = express.Router();

/**
 * @swagger
 *      components:
 *          securitySchemes:
 *            bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *          schemas:
 *            TypePharmacy:
 *              type: object
 *              required:
 *              - nameTypePharmacy
 *              properties:
 *                nameTypePharmacy:
 *                  type: string
 */

/**
 * @swagger
 *      tags:
 *          name:TypePharmacy
 */

/**
 * @swagger
 * /typePharmacy:
 *      get:
 *          summary: Return list all typePharmacy
 *          tags: [TypePharmacy]
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

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

/**
 * @swagger
 * /typePharmacy:
 *      post:
 *          summary: Post new TypePharmacy
 *          tags: [TypePharmacy]
 *          security:
 *          - bearerAuth: []
 *          requestBody :
 *            required : true
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/TypePharmacy'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

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

/**
 * @swagger
 * /typePharmacy/{typePharmacyID}:
 *      delete:
 *          summary: Delete typePharmacy
 *          tags: [TypePharmacy]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : typePharmacyID
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

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

module.exports = router;
