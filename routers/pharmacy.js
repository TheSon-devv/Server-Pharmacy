const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pharmacy = require("../model/Pharmacy");
const verifyToken = require("./verifyToken");
const multer = require("multer");

const storageUp = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadStorage = multer({
  storage: storageUp,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: fileFilter,
});

/**
 * @swagger
 *      components:
 *          securitySchemes:
 *            bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *          schemas:
 *            Pharmacy:
 *              type: object
 *              required:
 *              - namePharmacy
 *              - typePharmacy
 *              - pricePharmacy
 *              properties:
 *                namePharmacy:
 *                  type: string
 *                typePharmacy:
 *                  type: string
 *                pricePharmacy:
 *                  type: string
 *                information:
 *                  type: string
 *                status:
 *                  type: string
 *                promotion:
 *                  type: string
 *                pharmacyImage:
 *                  type: file
 */

/**
 * @swagger
 *      tags:
 *          name:Pharmacy
 */

/**
 * @swagger
 * /pharmacy:
 *      get:
 *          summary: Return list all pharmacy
 *          tags: [Pharmacy]
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/", async (req, res) => {
  try {
    const getPharmacy = await Pharmacy.find()
      .populate("typePharmacy")
      .sort({ dateCreate: -1 });
    res.json({ message: "Success", code: 200, getPharmacy });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

/**
 * @swagger
 * /pharmacy/topSale:
 *      get:
 *          summary: Return list all pharmacy in top sale
 *          tags: [Pharmacy]
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/topSale", async (req, res) => {
  try {
    const getPharmacySale = await Pharmacy.find()
      .populate("typePharmacy")
      .sort({ promotion: -1 });
    res.json({ message: "Success", code: 200, getPharmacySale });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

/**
 * @swagger
 * /pharmacy/{pharmacyID}:
 *      get:
 *          summary: Get the pharmacy by pharmacyID
 *          tags: [Pharmacy]
 *          parameters:
 *          - in: path
 *            name : pharmacyID
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/:pharmacyID", async (req, res) => {
  try {
    const getPharmacy = await Pharmacy.findById(req.params.pharmacyID).populate(
      "typePharmacy"
    );
    let data = [];
    data.push(getPharmacy);
    res.json({ message: "Success", code: 200, data });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.get("/", async (req, res) => {
  try {
    let query = req.query.typePharmacy;
    console.log(query);
    const getPharmacy = await Pharmacy.findById(req.params.pharmacyID);
    let data = [];
    data.push(getPharmacy);
    res.json({ message: "Success", code: 200, data });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

/**
 * @swagger
 * /pharmacy:
 *      post:
 *          summary: Post new Pharmacy
 *          tags: [Pharmacy]
 *          security:
 *          - bearerAuth: []
 *          requestBody :
 *            required : true
 *            content:
 *              multipart/form-data:
 *                schema:
 *                  $ref: '#/components/schemas/Pharmacy'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.post(
  "/",
  uploadStorage.single("pharmacyImage"),
  verifyToken,
  async (req, res) => {
    console.log(req.file);
    const dataPharmacy = new Pharmacy({
      namePharmacy: req.body.namePharmacy,
      typePharmacy: req.body.typePharmacy,
      pricePharmacy: Number(req.body.pricePharmacy).toFixed(2),
      information: req.body.information,
      status: req.body.status,
      promotion: req.body.promotion,
      totalPromotion: (
        Number(req.body.pricePharmacy) -
        Number(req.body.pricePharmacy * req.body.promotion) / 100
      ).toFixed(2),
      pharmacyImage: `http://localhost:4000/` + req.file.path,
    });
    console.log(dataPharmacy, "data");

    try {
      const maPharmacyOnly = await Pharmacy.findOne({ _id: req.body._id });
      if (!maPharmacyOnly) {
        const savePharmacy = await dataPharmacy.save();
        res.json({ message: "Success", code: 200, savePharmacy });
      } else {
        return res.json({ message: "Conflict !", code: 401 });
      }
    } catch (err) {
      res.status(400);
      res.json({ message: "Error", code: 400 });
      console.log(err);
    }
  }
);

/**
 * @swagger
 * /pharmacy/{pharmacyID}:
 *      delete:
 *          summary: Delete pharmacy
 *          tags: [Pharmacy]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : pharmacyID
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.delete("/:pharmacyID", verifyToken, async (req, res) => {
  try {
    const pharmacyID = await Pharmacy.findOne({ _id: req.params.pharmacyID });
    if (!pharmacyID)
      return res.json({ message: "Không tìm thấy sản phẩm !", code: 200 });
    const getPharmacy = await Pharmacy.deleteOne({
      _id: req.params.pharmacyID,
    });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

/**
 * @swagger
 * /pharmacy/{pharmacyID}:
 *      put:
 *          summary: Change information pharmacy
 *          tags: [Pharmacy]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : pharmacyID
 *            required : true
 *          requestBody :
 *            required : true
 *            content:
 *              multipart/form-data:
 *                schema:
 *                  $ref: '#/components/schemas/Pharmacy'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.put(
  "/:pharmacyID",
  uploadStorage.single("pharmacyImage"),
  verifyToken,
  async (req, res) => {
    console.log(req.file);
    try {
      const updatePharmacy = await Pharmacy.updateOne(
        { _id: req.params.pharmacyID },
        {
          $set: {
            namePharmacy: req.body.namePharmacy,
            pricePharmacy: Number(req.body.pricePharmacy).toFixed(2),
            information: req.body.information,
            status: req.body.status,
            promotion: req.body.promotion,
            totalPromotion: (
              Number(req.body.pricePharmacy) -
              Number(req.body.pricePharmacy * req.body.promotion) / 100
            ).toFixed(2),
            pharmacyImage: `http://localhost:4000/` + req.file.path,
          },
        }
      );
      res.json({ message: "Success", code: 200 });
    } catch (error) {
      res.json({ message: "Error", code: 400 });
    }
  }
);

module.exports = router;
