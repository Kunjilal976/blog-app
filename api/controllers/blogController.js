// controllers/blogController.js
const blogModel = require("../models/blog");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const create = async (req, res) => {
  console.log("form data: ", req.file, req.cookies);
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, description } = req.body;
    const blogDoc = await blogModel.create({
      title,
      summary,
      description,
      cover: newPath,
      author: info.id,
    });
    res.json(blogDoc);
  });
};

const getBlogs = async (req, res) => {
  const blogs = await blogModel
    .find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 });
  res.json(blogs);
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await blogModel.findById(id).populate("author", ["username"]);
  res.json(blog);
};

const editBlog = async (req, res) => {
  const { id } = req.params;
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, description } = req.body;
    const blogDoc = await blogModel.findById(id);
    const isAuthor = JSON.stringify(blogDoc.author._id) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    if (blogDoc) {
      blogDoc.title = title;
      blogDoc.summary = summary;
      blogDoc.description = description;
      blogDoc.cover = newPath ? newPath : blogDoc.cover;
      await blogDoc.save();
    }
    res.json(blogDoc);
  });
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  jwt.verify(token, SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const blogDoc = await blogModel.findById(id);
    const isAuthor = JSON.stringify(blogDoc.author._id) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    const cover = blogDoc.cover;
    fs.access(cover, fs.constants.F_OK, (err) => {
      if (err) {
        console.log("image not found");
      }
      fs.unlink(cover, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
        console.log("Image deleted successfully");
      });
    });
    await blogModel.findByIdAndRemove(id);
    res.status(202).json(blogDoc);
  });
};

module.exports = { create, getBlogs, getBlog, editBlog, deleteBlog };
