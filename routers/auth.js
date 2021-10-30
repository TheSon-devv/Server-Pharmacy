const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const router = express.Router();
const passport = require("passport");

const { UserValidate } = require("../validation");
const Admin = require("../model/Admin");

/**
 * @swagger
 *      components:
 *          securitySchemes:
 *            bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *          schemas:
 *            AdminRegister:
 *              type: object
 *              required:
 *              - email
 *              - password
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                nameLogin:
 *                  type: string
 *            AdminLogin:
 *              type: object
 *              required:
 *              - email
 *              - password
 *              properties:
 *                email:
 *                  type: string
 *                  example: 'thesonk7@gmail.com'
 *                password:
 *                  type: string
 *                  example: 'theson25@'
 */

/**
 * @swagger
 *      tags:
 *          name:Admin
 */

/**
 * @swagger
 * /auth/admin/register:
 *      post:
 *          summary: Register admin account
 *          tags: [Admin]
 *          requestBody :
 *            required : true
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AdminRegister'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

/**
 * @swagger
 * /auth/admin/login:
 *      post:
 *          summary: Admin login
 *          tags: [Admin]
 *          requestBody :
 *            required : true
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AdminLogin'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.post("/admin/register", async (req, res) => {
  //Validation
  const { error } = UserValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if user is already in the database
  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email is already");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const admin = new Admin({
    email: req.body.email,
    password: hashedPassword,
    nameLogin: req.body.nameLogin,
  });
  try {
    const savedUser = await admin.save();
    let dataRegister = {
      _id: savedUser._id,
      email: savedUser.email,
    };
    res.status(200).json({ message: "Success", code: 200, dataRegister });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.json({ message: "Sai email !", code: 403 });

    const validPassAdmin = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassAdmin)
      return res.json({ message: "Sai password !", code: 403 });

    const expiresTime = { expiresIn: 60000 };
    const accessToken = jwt.sign(
      { _id: admin._id, email: admin.email, password: admin.password },
      process.env.ACCESS_TOKEN_SECRET,
      expiresTime
    );
    const refreshToken = jwt.sign(
      { _id: admin._id, email: admin.email, password: admin.password },
      process.env.REFRESH_TOKEN_SECRET
    );

    let dataLogin = {
      email: admin.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: expiresTime.expiresIn,
      nameLogin: admin.nameLogin,
      userId: admin._id,
    };
    res.json({ message: "Success", code: 200, dataLogin });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
