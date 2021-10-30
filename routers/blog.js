const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../model/Blog");
const verifyToken = require("./verifyToken");
const multer = require("multer");
const Admin = require("../model/Admin");

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

const uploadBlog = multer({
  storage: storageUp,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: fileFilter,
});

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
 *            Blog:
 *              type: object
 *              required:
 *              - nameBlog
 *              - information
 *              - blogImage
 *              properties:
 *                nameBlog:
 *                  type: string
 *                information:
 *                  type: string
 *                adminCreate:
 *                  type: array
 *                  items:
 *                    type: string
 *                blogImage:
 *                  type: file
 */

/**
 * @swagger
 *      tags:
 *          name:Blog
 */

/**
 * @swagger
 * /blog:
 *      get:
 *          summary: Return list all blog
 *          tags: [Blog]
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/", async (req, res) => {
  try {
    const getBlog = await Blog.find().sort({ dateCreate: -1 });
    res.json({ message: "Success", code: 200, getBlog });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /blog/{blogID}:
 *      get:
 *          summary: Get the pharmacy by blogID
 *          tags: [Blog]
 *          parameters:
 *          - in: path
 *            name : blogID
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 */

router.get("/:blogID", async (req, res) => {
  try {
    const getBlog = await Blog.findById(req.params.blogID).populate(
      "Admin",
      "email"
    );
    let data = [];
    data.push(getBlog);
    res.json({ message: "Success", code: 200, data });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /blog:
 *      post:
 *          summary: Post new blog
 *          tags: [Blog]
 *          security:
 *          - bearerAuth: []
 *          requestBody :
 *            required : true
 *            content:
 *              multipart/form-data:
 *                schema:
 *                  $ref: '#/components/schemas/Blog'
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
  uploadBlog.single("blogImage"),
  verifyToken,
  async (req, res) => {
    const dataBlog = new Blog({
      nameBlog: req.body.nameBlog,
      information: req.body.information,
      adminCreate: req.body.adminCreate,
      blogImage: req.file.path,
    });
    try {
      const adminOnly = await Admin.findOne({ _id: req.body.adminCreate });
      if (adminOnly) {
        const saveBlog = await dataBlog.save();
        res.json({ message: "Success", code: 200, saveBlog });
      } else {
        res.json({ message: "Only admin create !", code: 404 });
      }
    } catch (err) {
      res.status(400);
      res.json({ message: err.message, code: 400 });
    }
  }
);

/**
 * @swagger
 * /blog/{blogID}:
 *      delete:
 *          summary: Delete blog
 *          tags: [Blog]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : blogID
 *            required : true
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.delete("/:blogID", verifyToken, async (req, res) => {
  try {
    const getBlog = await Blog.findById(req.params.blogID);
    if (!getBlog) {
      return res.json({ message: "The blog doesn't exists !", code: 404 });
    }
    await Blog.deleteOne({ _id: req.params.blogID });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: err.message, code: 400 });
  }
});

/**
 * @swagger
 * /blog/{blogID}:
 *      put:
 *          summary: Change information blog
 *          tags: [Blog]
 *          security:
 *          - bearerAuth: []
 *          parameters:
 *          - in: path
 *            name : blogID
 *            required : true
 *          requestBody :
 *            required : true
 *            content:
 *              multipart/form-data:
 *                schema:
 *                  $ref: '#/components/schemas/Blog'
 *          responses:
 *              200:
 *                  description : Successed
 *              400:
 *                  description : Error
 *              401:
 *                  description : Unauthorized
 */

router.put(
  "/:blogID",
  uploadBlog.single("blogImage"),
  verifyToken,
  async (req, res) => {
    try {
      const updatePharmacy = await Blog.updateOne(
        { _id: req.params.blogID },
        {
          $set: {
            nameBlog: req.body.nameBlog,
            information: req.body.information,
            adminCreate: req.body.adminCreate,
            blogImage: req.file.path,
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
