const Product = require('../models/ProductModel');
const asyncHandler =  require("express-async-handler");

const createProduct = asyncHandler(async(req,res)=>{
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct, )
    } catch (error) {
        throw new Error(error);
    }
    
});

const getaProduct  = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const getProduct = await Product.findById(id);
        res.json(getProduct);
    } catch (error) {
        throw new Error(error);
    }
});


const getallproducts = asyncHandler(async(req,res)=>{
    try {
        const getProducts = await Product.find();
        res.json(getProducts);
    } catch (error) {
        throw new Error(error);
    }
})













module.exports = {
                    createProduct,
                    getaProduct,
                    getallproducts,
                }