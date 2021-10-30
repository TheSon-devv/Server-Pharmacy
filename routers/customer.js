const express = require("express");
const mongoose = require("mongoose");
const Customer = require("../model/Customer");
const verifyToken = require("./verifyToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  //Validation
  // const { error } = UserValidate(req.body)
  // if (error) return res.status(400).send(error.details[0].message)

  //Checking if user is already in the database
  const emailExist = await Customer.findOne({ email: req.body.email });
  if (emailExist) return res.json({ message: "Email is already", code: 401 });

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const customer = new Customer({
    email: req.body.email,
    password: hashedPassword,
    nameKH: req.body.nameKH,
  });
  try {
    const savedCustomer = await customer.save();
    let dataRegister = {
      _id: savedCustomer._id,
      email: savedCustomer.email,
      nameKH: savedCustomer.nameKH,
    };
    res.status(200).json({ message: "Success", code: 200, dataRegister });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer)
      return res.json({
        message: "Sai email hoặc không tìm thấy email !",
        code: 403,
      });

    const validPass = await bcrypt.compare(
      req.body.password,
      customer.password
    );
    if (!validPass) return res.json({ message: "Sai password !", code: 403 });

    const expiresTime = { expiresIn: 60000 };
    const accessToken = jwt.sign(
      { _id: customer._id, email: customer.email, password: customer.password },
      process.env.ACCESS_TOKEN_SECRET,
      expiresTime
    );
    const refreshToken = jwt.sign(
      { _id: customer._id, email: customer.email, password: customer.password },
      process.env.REFRESH_TOKEN_SECRET
    );

    let dataLogin = {
      email: customer.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: expiresTime.expiresIn,
      userId: customer._id,
      nameKH: customer.nameKH,
      phoneNumber: customer.phoneNumber,
    };
    res.json({ message: "Success", code: 200, dataLogin });
  } catch (err) {
    res.send(err);
  }
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
 *            Customer:
 *              type: object
 *              required:
 *              - nameKH
 *              - password
 *              properties:
 *                nameKH:
 *                  type: string
 *                password:
 *                  type: string
 *                email:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 */

/**
 * @swagger
 *      tags:
 *          name:Customer
 */

/**
 * @swagger
 * /customer:
 *      get:
 *          summary: Return list all customer
 *          tags: [Customer]
 *          security:
 *          - bearerAuth: []
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/", verifyToken, async (req, res) => {
  try {
    const getCustomer = await Customer.find();
    res.json({ message: "Success", code: 200, getCustomer });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /customer/{customerID}:
 *      get:
 *          summary: Get the pharmacy by customerID
 *          tags: [Customer]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : customerID
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/:customerID", verifyToken, async (req, res) => {
  try {
    const getCustomer = await Customer.findById(req.params.customerID);
    res.json({ message: "Success", code: 200, getCustomer });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /customer:
 *      post:
 *          summary: Post new Customer
 *          tags: [Customer]
 *          security:
 *          - bearerAuth: []
 *          requestBody :
 *            required : true
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Customer'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.post("/", verifyToken, async (req, res) => {
  const dataCustomer = new Customer({
    nameKH: req.body.nameKH,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
  });
  try {
    const saveCustomer = await dataCustomer.save();
    res.json({ message: "Success", code: 200, saveCustomer });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /customer/{customerID}:
 *      delete:
 *          summary: Delete customer
 *          tags: [Customer]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : customerID
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.delete("/:customerID", verifyToken, async (req, res) => {
  try {
    const getCustomer = await Customer.findById(req.params.customerID);
    if (!getCustomer) {
      return res.json({ message: "The customer doesn't exists !", code: 404 });
    }
    await Customer.deleteOne({ _id: req.params.customerID });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /customer/{customerID}:
 *      put:
 *          summary: Change information customer
 *          tags: [Customer]
 *          parameters:
 *          - in: path
 *            name : customerID
 *            required : true
 *          requestBody :
 *            required : true
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Customer'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.put("/:customerID", async (req, res) => {
  try {
    const updateCustomer = await Customer.findByIdAndUpdate(
      req.params.customerID,
      {
        $set: {
          nameKH: req.body.nameKH,
          nameLogin: req.body.nameLogin,
          password: req.body.password,
          phoneNumber: req.body.phoneNumber,
        },
      },
      {
        new: true,
      }
    );
    res.json({ message: "Success", code: 200 });
  } catch (error) {
    res.json({ message: err.message, code: 400 });
  }
});

module.exports = router;
