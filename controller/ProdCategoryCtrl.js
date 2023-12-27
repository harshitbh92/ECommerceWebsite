const express = require("express");
const Category = require("../models/ProdCategoryModel");
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async(req,res)=>{
    try {
        const category = await Category.create(req.body);
        res.json(category);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports ={
    createCategory,
    
}