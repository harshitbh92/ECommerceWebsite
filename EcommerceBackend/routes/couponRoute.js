const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCoupon, getallCoupons, updateCoupon, deleteCoupon } = require("../controller/couponCtrl");
const router = express.Router();

router.post("/",authMiddleware,isAdmin,createCoupon);
router.get("/",getallCoupons);
router.put("/:id",authMiddleware,isAdmin,updateCoupon);
router.delete("/:id",authMiddleware,isAdmin,deleteCoupon);


module.exports = router;