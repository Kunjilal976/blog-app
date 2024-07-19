// routes/blogRoutes.js
const express = require("express");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "./uploads/", limits: { fieldSize: 25 * 1024 * 1024 } });

const { create, getBlogs, getBlog, editBlog, deleteBlog } = require("../controllers/blogController");

const blogRouter = express.Router();

blogRouter.post("/create", uploadMiddleware.single("files"), create);
blogRouter.get("/getBlogs", getBlogs);
blogRouter.put("/:id", uploadMiddleware.single("file"), editBlog);
blogRouter.get("/:id", getBlog);
blogRouter.delete("/:id", deleteBlog);

module.exports = blogRouter;
