const { createBlog, updateBlog, getBlog, getAllBlogs, DeleteBlog, likeBlog, DislikeBlog, uploadImages } = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const express = require("express");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadimages");

const router = express.Router();

router.post("/",authMiddleware,isAdmin,createBlog);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array("images",10),blogImgResize,uploadImages);
//10 -> max no of files it can accept at a time

router.put("/likes",authMiddleware,likeBlog);
router.put("/dislike",authMiddleware,DislikeBlog);
router.put("/:id",authMiddleware,isAdmin,updateBlog);
router.get("/:id",getBlog);
router.get("/",getAllBlogs);
router.delete("/:id",authMiddleware,isAdmin,DeleteBlog);

module.exports = router;
