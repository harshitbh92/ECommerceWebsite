//LOGIN CONTROLLER
//require user models
const { generateToken } = require("../config/jwtToken"); 
const User = require("../models/userModel");
const Product = require("../models/ProductModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
const validateMongodbID = require("../utils/validateMongodbId");
const { log } = require("console");
const uniqid = require("uniqid");

// const sendEmail= require("../controller/emailCtrl");
//create new users
const createUser = asyncHandler(async(req,res) => {
        const email = req.body.email;
        const findUser = await User.findOne({email});
        if(!findUser)
        {
            //Create a new User
            const newUser = await User.create(req.body);
            res.json(newUser);
        }
        else
        {
            throw new Error("User Already exists");
        }
    });

//to login a user
const loginUserCtrl = asyncHandler(async (req,res)=>{
        const {email,password} = req.body;
        //console.log(email , password);
        const findUser = await User.findOne({email});
        //console.log(findUser);
        if(findUser && (await findUser.isPasswordMatched(password))){
                const refreshToken = await generateRefreshToken(findUser?.id);
                const updateUser = await User.findByIdAndUpdate(
                        findUser.id,
                        {
                                refreshToken: refreshToken,

                        },
                        {
                                new:true,
                        }
                );
                res.cookie("refreshToken",refreshToken,{//creates cookie named refreshtoken with value "refreshtoken"
                        httpOnly : true,//it means that the cookie is only accessible 
                        //on the server-side and not through JavaScript on the client-side.
                        maxAge : 72*60*60*1000,
                });
                res.json({
                        _id : findUser?._id,
                        firstname : findUser?.firstname,
                        lastname : findUser?.lastname,
                        email : findUser?.email,
                        mobile : findUser?.mobile,
                        token : generateToken(findUser?._id),
                });
        }
        else{
                throw new Error("Invalid Credentials");
        }
});

//admin login
const adminLogin = asyncHandler(async (req,res)=>{
        const {email,password} = req.body;
        //console.log(email , password);
        const findadmin = await User.findOne({email});
        if(findadmin.role !== "admin")
        {
                throw new Error("You are not Authorized to carry out this operation");
        }
        //console.log(findUser);
        if(findadmin && (await findadmin.isPasswordMatched(password))){
                const refreshToken = await generateRefreshToken(findadmin?.id);
                const updateUser = await User.findByIdAndUpdate(
                        findadmin.id,
                        {
                                refreshToken: refreshToken,

                        },
                        {
                                new:true,
                        }
                );
                res.cookie("refreshToken",refreshToken,{//creates cookie named refreshtoken with value "refreshtoken"
                        httpOnly : true,//it means that the cookie is only accessible 
                        //on the server-side and not through JavaScript on the client-side.
                        maxAge : 72*60*60*1000,
                });
                res.json({
                        _id : findadmin?._id,
                        firstname : findadmin?.firstname,
                        lastname : findadmin?.lastname,
                        email : findadmin?.email,
                        mobile : findadmin?.mobile,
                        token : generateToken(findadmin?._id),
                        role : findadmin?.role,
                });
        }
        else{
                throw new Error("Invalid Credentials");
        }
});


//Handle refresh token
const handleRefreshToken = asyncHandler(async(req,res)=>{
        const cookie = req.cookies;
        //console.log(cookie);
        if(!cookie?.refreshToken)
        {
                throw new Error("No refresh token in Cookies");
        }
        const refreshToken  = cookie.refreshToken;
        console.log(refreshToken);
        const user = await User.findOne({refreshToken});
        if(!user)
        {
                throw new Error("No token attached or not found!");
        }
        //if token found in cookies and also in db then verify that token
        jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
                // console.log(decoded); --> id is returned
                if(err || user.id !== decoded.id)
                {
                        console.log("Something went wrong!!");
                }
                else
                {
                        const accessToken = generateToken(user?._id);
                        res.json({accessToken});
                }
        });

        //res.json(user);

});

//logout a user 
const logoutauser = asyncHandler(async(req,res)=>{
        const cookie = req.cookies;
        if(!cookie?.refreshToken)
        {
                throw new Error("No token attached!");
        }
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({refreshToken});
        if(!user)
        {
                res.clearCookie("refreshToken",{
                        httpOnly :true,
                        secure : true,
                });
                return res.sendStatus(204); // forbidden
        }
        await User.findByIdAndUpdate("refreshToken",{
                refreshToken:"",
        });
        res.clearCookie("refreshToken",{
                httpOnly :true,
                secure : true,
        });
        return res.sendStatus(204); // forbidden

});







//update a user
const updateaUser = asyncHandler(async(req,res)=>{
        const {id} = req.user;
        validateMongodbID(id);
        try {
                const updateUser =await User.findByIdAndUpdate(
                        id,
                        {
                                firstname : req?.body?.firstname,
                                lastname : req?.body?.lastname,
                                email : req?.body?.email,
                                mobile : req?.body?.mobile,
                        },
                        {
                                new:true,
                        }
                );
                res.json(updateUser);
        } catch (error) {
                throw new Error(error);
        }
});


//get all users
const getallUser = asyncHandler(async (req,res)=>{
        try {
                const getUsers = await User.find();
                res.json(getUsers);
        } catch (error) {
                throw new Error(error);
        }
});

//get a single user
const getaUser = asyncHandler(async (req,res)=>{
        const {id} = req.params;
        validateMongodbID(id);
        try {
                const getUser = await User.findById(id);
                res.json({getUser});
        } catch (error) {
                throw new Error(error);
        }
});

//delete a user
const DeleteaUser = asyncHandler(async (req,res)=>{
        const {id} = req.params;
        validateMongodbID(id); 
        try {
                const DeleteUser = await User.findByIdAndDelete(id);
                res.json({DeleteUser});
        } catch (error) {
                throw new Error(error);
        }
});
//block and unblock a user
const blockUser =asyncHandler(async(req,res)=>{
        const {id} = req.params;
        validateMongodbID(id);
        try {
                const block = await User.findByIdAndUpdate(
                        id,
                        {
                                isBlocked:true,
                        },
                        {
                                new:true
                        }
                );
                res.json({
                        message:"User blocked",
                });
        } catch (error) {
                throw new Error(error);
        }
}) ;
const unblockUser = asyncHandler(async(req,res)=>{
        const {id} = req.params;
        validateMongodbID(id);
        try {
                const unblock = await User.findByIdAndUpdate(
                        id,
                        {
                                isBlocked:false,
                        },
                        {
                                new:true
                        }
                );
                res.json({
                        message:"User Unblocked",
                });
        } catch (error) {
                throw new Error(error);
        }
});


const updatePassword = asyncHandler(async (req, res) => {
        try {
            const { id } = req.user;
            const { password } = req.body; // Use destructuring to get the password from req.body
            validateMongodbID(id);
            
            // Use await to ensure that the User.findById() resolves to a user object
            const user = await User.findById(id);
    
            if (user) {
                // Update the password only if it's provided in the request body
                if (password) {
                    user.password = password;
                    const updatedUser = await user.save();
                    res.json(updatedUser);
                } else {
                    res.status(400).json({ error: 'Password is required for update' });
                }
            } else {
                // Handle the case where the user is not found
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    const forgotPasswordToken = asyncHandler(async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
    
            if (!user) {
                throw new Error("User does not exist or Email not registered!");
            }
    
            const token = await user.createPasswordResetToken();
            await user.save();
    
            const resetURL = `Hi, Please follow this link to reset your password. Note : This link is valid only 
                for 10 minutes. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;
    
            const data = {
                to: email,
                subject: "Forgot Password-> Reset Password",
                text: "Hey User",
                html: resetURL,
            };
    
            sendEmail(data);
            res.json(token);
        } catch (error) {
            throw new Error(error);
        }
    });
    
    const resetPassword = asyncHandler(async (req, res) => {
        try {
            const { password } = req.body;
            const { token } = req.params;
            const hashToken = crypto.createHash('sha256').update(token).digest("hex");
    
            // Use await with User.findOne to ensure it returns a promise
            const user = await User.findOne({
                passwordResetToken: hashToken,
                passwordResetExpires: { $gt: Date.now() },
            });
    
            if (!user) {
                throw new Error("Token Expired! Please try Again!!");
            }
    
            // Update user properties
            user.password = password;
            user.passwordResetToken = undefined; // Correct syntax to update fields
            user.passwordResetExpires = undefined; // Correct syntax to update fields
    
            // Save the user document
            await user.save();
    
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
//     const resetPassword = asyncHandler(async(req,res)=>{
//         const {password} = req.body;
//         const {token} = req.params;
//         const hashToken = crypto.createHash('sha256').update(token).digest("hex"); 
//         const user = User.findOne({
//                 passwordResetToken : hashToken,
//                 passwordResetExpires : { $gt : Date.now()},
//         });
//         if(!user)
//         {
//                 throw new Error("Token Expired! Please try Again!!");
//         }
//         user.password = password;
//         passwordResetToken : undefined;
//         passwordResetExpires : undefined;
//         await user.save();
//         res.json(user);
//     });

//wishlist of products links to ---> ProductCtrl Wishlist
const getWishlist = asyncHandler(async(req,res)=>{
        const {_id} = req.user;
        validateMongodbID(_id);
        try {
                const findUser = await User.findById(_id).populate("wishlist");
                res.json(findUser);
        } catch (error) {
                throw new Error(error);
        }
});


//save address of user
const saveAddress = asyncHandler(async(req,res)=>{
        const {_id} = req.user;
        try {
                const newaddruser = await User.findByIdAndUpdate(_id,
                        {
                                address : req?.body?.address,
                        },
                        {
                                new:true,
                        });
                res.json(newaddruser);
        } catch (error) {
                throw new Error(error);
        }
});

const userCart = asyncHandler(async(req,res)=>{
        const { cart } = req.body;
        const { _id } = req.user;
        validateMongodbID(_id);
        try {
                let products = [];
                const user = await User.findById(_id);
                // check if user already have product in cart
                const alreadyExistCart = await Cart.findOne({ orderby: user._id });
                if (alreadyExistCart) {
                alreadyExistCart.remove();
                }
                for (let i = 0; i < cart.length; i++) {
                        let object = {};
                        object.product = cart[i]._id;
                        object.count = cart[i].count;
                        object.color = cart[i].color;
                        let getPrice = await Product.findById(cart[i]._id).select("price").exec();
                        object.price = getPrice.price;
                        products.push(object);
                }
                let cartTotal = 0;
                for (let i = 0; i < products.length; i++) {
                        cartTotal = cartTotal + products[i].price * products[i].count;
                }
                // console.log(products,cartTotal);
                let newCart = await new Cart({
                        products,
                        cartTotal,
                        orderBy : user?._id
                }).save();
                res.json(newCart);
        } catch (error) {
                throw new Error(error);
        }
});
const getUserCart = asyncHandler(async(req,res)=>{
        const {_id} = req.user;
        validateMongodbID(_id);
        try {
                const cart = await Cart.findOne({ orderBy : _id}).populate("products.product");
                res.json(cart);
        } catch (error) {
                throw new Error(error);
        }
});

const emptyCart = asyncHandler(async(req,res)=>{
        const {_id} =req.user;
        console.log(req.user);
        validateMongodbID(_id);
        try {
                const user = await User.findOne(_id);
                const cart = await Cart.findOneAndRemove({orderBy : user?._id});
                res.json(cart);

        } catch (error) {
                throw new Error(error);
        }
})
// const emptyCart = asyncHandler(async (req, res) => {
//         const { _id } = req.user;
//         validateMongodbID(_id);
//         try {
//           const user = await User.findOne({ _id });
//           const cart = await Cart.findOneAndRemove({ orderBy: user._id });
//           res.json(cart);
//         } catch (error) {
//           throw new Error(error);
//         }
//       });
    
const applyCoupon = asyncHandler(async(req,res)=>{
        const {_id} = req.user;
        validateMongodbID(_id);
        const {coupon } = req.body;
        const validCoupon = await Coupon.findOne({name : coupon});
        if(validCoupon === null)
        {
                throw new Error("Invalid Coupon");
        }
        const user = await User.findOne(_id);
        let {products, cartTotal} = await Cart.findOne({orderBy : user._id}).populate("products.product");
        let totalafterDiscount = (cartTotal - ( validCoupon.discount)).toFixed(2);
        await Cart.findOneAndUpdate(
                { orderBy : user?._id},
                { totalafterDiscount },
                {new : true}
        );
        res.json(totalafterDiscount);
});


const createOrder = asyncHandler(async(req,res)=>{
        const {_id} = req.user;
        const { COD, appliedCoupon } = req.body;
        validateMongodbID(_id);
        try {
                if(!COD)
                {
                        throw new Error("Order Failed!!")
                }
                const user = await User.findById(_id);
                const userCart = await Cart.findOne({orderBy : user?._id});
                let finalAmount = 0;
                if(appliedCoupon && userCart.totalafterDiscount)
                {
                        finalAmount = userCart.totalafterDiscount;
                }
                else{
                        finalAmount =userCart.cartTotal;
                }
                let newOrder = await new Order({
                        products : userCart.products,
                        paymentIntent : {
                                id : uniqid(),
                                method : "COD",
                                amount : finalAmount,
                                status : "Cash On Delivery",
                                created : Date.now(),
                                currency : "inr",
                        },
                        orderBy : user?._id,
                        orderStatus : "Cash On Delivery"
                }).save();
                //now we need to decrease the quantity and increase sold quantity
                let update = userCart.products.map((item)=>{
                        return {
                                updateOne :{
                                        filter : {_id : item.product._id},
                                        update : {$inc : {quantity : -item.count, sold : +item.count}},

                                },
                        };
                });
                const updated = await Product.bulkWrite(update, {});
                res.json( {message : "success"});
        } catch (error) {
                throw new Error(error);
        }
});


const getOrders = asyncHandler(async(req,res)=>{
        const {_id} = req.user;

        validateMongodbID(_id);
        try {
                const allorders = await Order.findOne({orderBy : _id}).populate("products.product").exec();
                res.json(allorders);
        } catch (error) {
                throw new Error(error);
        }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
        const { status ,paymentStatus} = req.body;
        const { id } = req.params;
        validateMongodbID(id);
        try {
          const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
              orderStatus: status,
              paymentIntent: {
                status: paymentStatus,
              },
            },
            { new: true }
          );
          res.json(updateOrderStatus);
        } catch (error) {
          throw new Error(error);
        }
      });


module.exports = { createUser,
         loginUserCtrl,
          getallUser,
          getaUser, 
          DeleteaUser,
           updateaUser,
           blockUser,
           unblockUser, 
           handleRefreshToken,
           logoutauser,
           updatePassword,
           forgotPasswordToken,
           resetPassword,
           adminLogin,
           getWishlist,
           saveAddress,
           userCart,
           getUserCart,
           emptyCart,
           applyCoupon,
           createOrder,
           getOrders,
           updateOrderStatus,



};