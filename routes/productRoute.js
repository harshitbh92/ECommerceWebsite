const express = require("express");
const { createProduct, getaProduct, getallproducts, updateaProduct, deleteaproduct, addToWishlist } = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware,isAdmin,createProduct);
router.put("/wishlist",authMiddleware,addToWishlist);
router.get("/:id",getaProduct);
router.put("/:id",authMiddleware,isAdmin,updateaProduct);
router.get("/",getallproducts);
router.delete("/:id",authMiddleware,isAdmin,deleteaproduct);




module.exports = router;