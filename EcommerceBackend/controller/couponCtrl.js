const Coupon = require("../models/couponModel");
const validateMongodbID = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");


const createCoupon = asyncHandler(async(req,res)=>{
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const getallCoupons = asyncHandler(async(req,res)=>{
    try {
        const allcoupons = await Coupon.find();
        res.json(allcoupons);
    } catch (error) {
        throw new Error(error);
    }

});

const updateCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            req.body,
            {
                new:true
            }
        );
        res.json(updatedCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const deletedcoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedcoupon);
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = {
    createCoupon,
    getallCoupons,
    updateCoupon,
    deleteCoupon,

}