const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Doctor = require("../model/Doctor");
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
 *            Doctor:
 *              type: object
 *              required:
 *              - doctorImage
 *              properties:
 *                nameDoctor:
 *                  type: string
 *                workplace:
 *                  type: string
 *                experienceYear:
 *                  type: string
 *                experience:
 *                  type: string
 *                details:
 *                  type: string
 *                education:
 *                  type: string
 *                doctorImage:
 *                  type: file
 */

/**
 * @swagger
 *      tags:
 *          name:Doctor
 */

/**
 * @swagger
 * /doctor:
 *      get:
 *          summary: Return list all doctor
 *          tags: [Doctor]
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/", async (req, res) => {
  try {
    const getDoctor = await Doctor.find();
    res.json({ message: "Success", code: 200, getDoctor });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /doctor/{doctorId}:
 *      get:
 *          summary: Get the pharmacy by doctorId
 *          tags: [Doctor]
 *          parameters:
 *          - in: path
 *            name : doctorId
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/:doctorId", async (req, res) => {
  try {
    const getDoctor = await Doctor.findById(req.params.doctorId);
    let data = [];
    data.push(getDoctor);
    res.json({ message: "Success", code: 200, data });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /doctor:
 *      post:
 *          summary: Post new Doctor
 *          tags: [Doctor]
 *          security:
 *          - bearerAuth: []
 *          requestBody :
 *            required : true
 *            content:
 *              multipart/form-data:
 *                schema:
 *                  $ref: '#/components/schemas/Doctor'
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
  uploadStorage.single("doctorImage"),
  verifyToken,
  async (req, res) => {
    const dataDoctor = new Doctor({
      nameDoctor: req.body.nameDoctor,
      workplace: req.body.workplace,
      education: req.body.education,
      experience: req.body.experience,
      experienceYear: req.body.experienceYear,
      details: req.body.details,
      doctorImage: req.file.path,
    });

    try {
      const saveDoctor = await dataDoctor.save();
      res.json({ message: "Success", code: 200, saveDoctor });
    } catch (err) {
      res.status(400);
      res.json({ message: err.message, code: 400 });
    }
  }
);

/**
 * @swagger
 * /doctor/{doctorId}:
 *      delete:
 *          summary: Delete doctor
 *          tags: [Doctor]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : doctorId
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.delete("/:doctorId", verifyToken, async (req, res) => {
  try {
    const getDoctor = await Doctor.findById(req.params.doctorId);
    if (!getDoctor) {
      return res.json({ message: "The doctor doesn't exists !", code: 404 });
    }
    await Doctor.deleteOne({ _id: req.params.doctorId });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /doctor/{doctorId}:
 *      put:
 *          summary: Change information doctor
 *          tags: [Doctor]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : doctorId
 *            required : true
 *          requestBody :
 *            required : true
 *            content:
 *              multipart/form-data:
 *                schema:
 *                  $ref: '#/components/schemas/Doctor'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.put(
  "/:doctorId",
  uploadStorage.single("doctorImage"),
  verifyToken,
  async (req, res) => {
    try {
      const updateDoctor = await Doctor.updateOne(
        { _id: req.params.doctorId },
        {
          $set: {
            nameDoctor: req.body.nameDoctor,
            workplace: req.body.workplace,
            education: req.body.education,
            experience: req.body.experience,
            experienceYear: req.body.experienceYear,
            details: req.body.details,
            doctorImage: req.file.path,
          },
        }
      );
      res.json({ message: "Success", code: 200 });
    } catch (error) {
      res.json({ message: err.message, code: 400 });
    }
  }
);

module.exports = router;
