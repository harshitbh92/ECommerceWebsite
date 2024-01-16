const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createblogCategory, updateblogCategory, deleteblogCategory, getblogCategory, getallblogCategory } = require("../controller/blogCatCtrl");
const router = express.Router();

router.post("/",authMiddleware,isAdmin,createblogCategory);
router.put("/:id",authMiddleware,isAdmin,updateblogCategory);
router.delete("/:id",authMiddleware,isAdmin,deleteblogCategory);
router.get("/:id",getblogCategory);
router.get("/",getallblogCategory);

module.exports = router;