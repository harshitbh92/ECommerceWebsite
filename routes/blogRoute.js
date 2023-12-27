const { createBlog, updateBlog, getBlog, getAllBlogs, DeleteBlog, likeBlog, DislikeBlog } = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

router.post("/",authMiddleware,isAdmin,createBlog);
router.put("/likes",authMiddleware,likeBlog);
router.put("/dislike",authMiddleware,DislikeBlog);
router.put("/:id",authMiddleware,isAdmin,updateBlog);
router.get("/:id",getBlog);
router.get("/",getAllBlogs);
router.delete("/:id",authMiddleware,isAdmin,DeleteBlog);

module.exports = router;
