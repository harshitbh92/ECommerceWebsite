const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCategory } = require("../controller/ProdCategoryCtrl");
const router = express.Router();

router.post("/",authMiddleware,isAdmin,createCategory);

module.exports = router;