const express = require("express");
const { createProduct, getaProduct, getallproducts, updateaProduct, deleteaproduct, addToWishlist, rating, uploadImages } = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadimages");
const router = express.Router();

router.post("/",authMiddleware,isAdmin,createProduct);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array("images",10),productImgResize,uploadImages);
router.put("/rating", authMiddleware,rating);
router.put("/wishlist",authMiddleware,addToWishlist);
router.get("/:id",getaProduct);
router.put("/:id",authMiddleware,isAdmin,updateaProduct);
router.get("/",getallproducts);
router.delete("/:id",authMiddleware,isAdmin,deleteaproduct);





module.exports = router;