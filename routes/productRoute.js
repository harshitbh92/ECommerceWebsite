const express = require("express");
const { createProduct, getaProduct, getallproducts, updateaProduct, deleteaproduct } = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware,isAdmin,createProduct);
router.get("/:id",getaProduct);
router.put("/:id",authMiddleware,isAdmin,updateaProduct);
router.get("/",getallproducts);
router.delete("/:id",authMiddleware,isAdmin,deleteaproduct);



module.exports = router;