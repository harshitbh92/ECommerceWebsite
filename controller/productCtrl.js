const Product = require('../models/ProductModel');
const User = require("../models/userModel");
const asyncHandler =  require("express-async-handler");
const slugify = require("slugify");
const { updateaUser } = require('./userCtrl');
const validateMongodbID = require("../utils/validateMongodbId");


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
    const {_id} = req.params;
    validateMongodbID(_id);
    console.log(_id);
    try {
        if(req.body.title)
        {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(
            _id,
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
    validateMongodbID(id);
    try {
        
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
})

const getaProduct  = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbID(id);
    try {
        const getProduct = await Product.findById(id);
        res.json(getProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getallproducts = asyncHandler(async(req,res)=>{
    try {
        // console.log(req.query);
        const queryObj = {...req.query};
        const excludefields = ['page','sort','limit','fields'];
        excludefields.forEach((el)=> delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //->/g is needed so that it matches for all if g was not there it matched with only one
        //refer to replace() in Javascript 
        let query = Product.find(JSON.parse(queryStr));

        // sorting
        if(req.query.sort)
        {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }
        else
        {
            query = query.sort("-createdAt");
        }

        //limiting
        if(req.query.fields)
        {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields); 
        }
        else{
            query = query.select("-__v");
        }


        // //pagination
        const page = req.query.page;
        const limit = req.query.limit; //limit of how many products on a page
        const skip = (page-1)*limit;//skips the pages not to show at that page
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount)
            {
                throw new Error("This page does not exist!!");
            }
        }

        const product = await query;
        // const getallproducts = await Product.find(req.query);
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
      const user = await User.findById(_id);
      const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    //   console.log(alreadyadded); // we get ObjectIs in this
      if (alreadyadded) {
        let user = await User.findByIdAndUpdate(
          _id,
          {
            $pull: { wishlist: prodId },
          },
          {
            new: true,
          }
        );
        res.json(user);
      } else {
        let user = await User.findByIdAndUpdate(
          _id,
          {
            $push: { wishlist: prodId },
          },
          {
            new: true,
          }
        );
        res.json(user);
      }
    } catch (error) {
      throw new Error(error);
    }
  });


  const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
      const product = await Product.findById(prodId);
      let alreadyRated = product.ratings.find(
        (userId) => userId.postedby.toString() === _id.toString()
      );
      if (alreadyRated) {
        const updateRating = await Product.updateOne(
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment },
          },
          {
            new: true,
          }
        );
      } else {
        const rateProduct = await Product.findByIdAndUpdate(
          prodId,
          {
            $push: {
              ratings: {
                star: star,
                comment: comment,
                postedby: _id,
              },
            },
          },
          {
            new: true,
          }
        );
      }
      const getallratings = await Product.findById(prodId);
      let totalRating = getallratings.ratings.length;
      let ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
      let actualRating = Math.round(ratingsum / totalRating);
      let finalproduct = await Product.findByIdAndUpdate(
        prodId,
        {
          totalrating: actualRating,
        },
        { new: true }
      );
      res.json(finalproduct);
    } catch (error) {
      throw new Error(error);
    }
  });



module.exports = {
                    createProduct,
                    getaProduct,
                    getallproducts,
                    updateaProduct,
                    deleteaproduct,
                    addToWishlist,
                    rating,


                }