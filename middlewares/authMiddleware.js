//verify the jwt token
//also check user for admin
const User = require("../models/userModel");
const jwt =  require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async(req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer"))// "Bearer <token>" so space extracts the token
    {
        token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            //console.log(decoded);
            const user = await User.findById(decoded?.id);
            req.user = user;
            next();
        } catch (error) {
            throw new Error("Not Authorized, Token Expired! Please login again!");
        }
    }
    else{
        throw new Error("There is no token attached to the header");
    }
});

//for admin authorization
const isAdmin = asyncHandler(async(req,res,next)=>{
    const {email} =req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role!=='admin')
    {
        throw new Error("You are not an Admin. Access Denied!");
    }
    else{
        next();
    }
})
module.exports = {authMiddleware,isAdmin};