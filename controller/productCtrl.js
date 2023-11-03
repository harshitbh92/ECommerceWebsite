const Product = require('../models/ProductModel');
const asyncHandler =  require("express-async-handler");
const slugify = require("slugify");
const { updateaUser } = require('./userCtrl');


const createProduct = asyncHandler(async(req,res)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct, )
    } catch (error) {
        throw new Error(error);
    }
    
});


const updateaProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    console.log(id);
    try {
        if(req.body.title)
        {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new:true,
            }

        );
        //console.log(req.body);
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});


const deleteaproduct = asyncHandler(async(req,res)=>{4
    const {id} = req.params;
    try {
        
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
})

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
    // console.log(req.query);
    try {
        // const getProducts = await Product.find(req.query); //for filtering this can be used too
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
                    updateaProduct,
                    deleteaproduct
                }