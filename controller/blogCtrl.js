const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const validateMongodbID = require("../utils/validateMongodbId");

const createBlog = asyncHandler(async(req,res)=>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "success",
            newBlog,
        })
    } catch (error) {
        throw new Error;
    }
});

const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbID(id);
    try {
        const updatedBlog =await Blog.findByIdAndUpdate(id,req.body, {
            new:true
        });
        res.json(updatedBlog);
    } catch (error) {
        throw new error(error);
    }
});

const getBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbID(id);
    try {
        const getaBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        await Blog.findByIdAndUpdate(
            id,
            {
                $inc : {numViews:1},
            },
            {
                new:true,
            }
        )
        res.json(getaBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlogs =  asyncHandler(async(req,res)=>{
    try {
        const allBlogs = await Blog.find();
        res.json(allBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

const DeleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbID(id);
    try {
        const delBlog = await Blog.findByIdAndDelete(id);
        res.json(delBlog);
    } catch (error) {
        throw new Error(error);
    }
});

// const likeBlog = asyncHandler(async(req,res)=>{
//     const {blogId} = req.body;
//     validateMongodbID(blogId);
//     //blog to like
//     const blog = await Blog.findById(blogId);
//     //user logged in
//     const loginUserId = req?.user?._id;
//     const isLiked = blog?.isLiked;
//     const alreadyDisliked = blog?.dislikes?.find(
//         (userId => userId?.toString() === loginUserId?.toString())
//         );
//     if(alreadyDisliked)
//     {
//         const blog = await Blog.findByIdAndUpdate(blogId,
//             {
//                 $pull : { dislikes: loginUserId},
//                 isDisliked : false
//             },
//             {
//                 new:true,
//             }
//         );
//         res.json(blog);    
//     }
//     if(isLiked)
//     {
//         const blog = await Blog.findByIdAndUpdate(blogId,
//             {
//                 $pull : { likes: loginUserId},
//                 isliked : false,
//             },
//             {
//                 new:true,
//             }
//         );
//         res.json(blog);  
//     }
//     else
//     {
//         const blog = await Blog.findByIdAndUpdate(blogId,
//             {
//                 $push : { dislikes: loginUserId},
//                 isliked : true
//             },
//             {
//                 new:true,
//             }
//         );
//         res.json(blog);  
//     }

// });

const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbID(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  });

  const DislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbID(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  });


module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    DeleteBlog,
    likeBlog,
    DislikeBlog,

}
