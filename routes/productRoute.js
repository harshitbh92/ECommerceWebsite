const express = require("express");
const { createProduct, getaProduct, getallproducts } = require("../controller/productCtrl");
const router = express.Router();

router.post("/",createProduct);
router.get("/:id",getaProduct);
router.get("/",getallproducts);



module.exports = router;