const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
    try {
      const newCategory = await Brand.create(req.body);
      res.json(newCategory);
    } catch (error) {
      throw new Error(error);
    }
  });


const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbID(id);
    try {
        const updatedCategory = await Brand.findByIdAndUpdate(id, req.body, 
            {
                new:true,
            });
            res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});
 
const deleteCategory = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    validateMongodbID(id);
    try {
        const deletedCategory =await Brand.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getCategory = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    try {
        const allcategories = await Brand.findById(id);
        res.json(allcategories);
    } catch (error) {
        throw new Error(error);
    }
});

const getallCategory =  asyncHandler(async(req,res)=>{
    try {
        const allcategories = await Brand.find();
        res.json(allcategories);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports ={
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory,
}