const blogCategory = require("../models/BlogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbId");

const createblogCategory = asyncHandler(async (req, res) => {
    try {
      const newCategory = await blogCategory.create(req.body);
      res.json(newCategory);
    } catch (error) {
      throw new Error(error);
    }
  });


const updateblogCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbID(id);
    try {
        const updatedCategory = await blogCategory.findByIdAndUpdate(id, req.body, 
            {
                new:true,
            });
            res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});
 
const deleteblogCategory = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    validateMongodbID(id);
    try {
        const deletedCategory =await blogCategory.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getblogCategory = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    try {
        const allcategories = await blogCategory.findById(id);
        res.json(allcategories);
    } catch (error) {
        throw new Error(error);
    }
});

const getallblogCategory =  asyncHandler(async(req,res)=>{
    try {
        const allcategories = await blogCategory.find();
        res.json(allcategories);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports ={
    createblogCategory,
    updateblogCategory,
    deleteblogCategory,
    getblogCategory,
    getallblogCategory,
}