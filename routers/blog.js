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

router.get("/", async (req, res) => {
  try {
    const getBlog = await Blog.find().sort({ dateCreate: -1 });
    res.json({ message: "Success", code: 200, getBlog });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

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
    res.json({ message: "Error", code: 400 });
  }
});

router.post(
  "/",
  uploadBlog.single("blogImage"),
  verifyToken,
  async (req, res) => {
    console.log(req.file);
    const dataBlog = new Blog({
      nameBlog: req.body.nameBlog,
      information: req.body.information,
      adminCreate: req.body.adminCreate,
      blogImage: `http://localhost:4000/` + req.file.path,
    });
    try {
      const adminOnly = await Admin.findOne({ _id: req.body.adminCreate });
      // console.log(adminOnly)
      if (adminOnly) {
        const saveBlog = await dataBlog.save();
        res.json({ message: "Success", code: 200, saveBlog });
      } else {
        res.json({ message: "Only admin create !", code: 404 });
      }
    } catch (err) {
      res.status(400);
      res.json({ message: "Error", code: 400 });
    }
  }
);

router.delete("/:blogID", verifyToken, async (req, res) => {
  try {
    const getBlog = await Blog.deleteOne({ _id: req.params.blogID });
    res.json({ message: "Success", code: 200 });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error", code: 400 });
  }
});

router.put(
  "/:blogID",
  uploadBlog.single("blogImage"),
  verifyToken,
  async (req, res) => {
    try {
      console.log(req.file);
      const updatePharmacy = await Blog.updateOne(
        { _id: req.params.blogID },
        {
          $set: {
            nameBlog: req.body.nameBlog,
            information: req.body.information,
            adminCreate: req.body.adminCreate,
            blogImage: `http://localhost:4000/` + req.file.path,
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
