//LOGIN CONTROLLER
//require user models
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongodbID } = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
//create new users
const createUser = asyncHandler(async(req,res) => {
        const email = req.body.email;
        const findUser = await User.findOne({email : email});
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
//     try {
//             await User.findOne({email : email}).then(async(user) => {
//                     if(!user) {
//                             const newUser = await User.create(req.body);
//                             return res.json(newUser);
//                     }       
//                     else {
//                             return res.json({
//                                     msg : "User already exists!",
//                                     success : false,
//                             });     
//                     }}).catch(err => {
//                             console.log("This is the error ",err);
//                     });
            
//             }
//      catch(err) {  
//             console.log("Second err ",err);
//     }       
// }


// const createUser = async (req,res)=>{
//     //if user already exists or a new User
//     const email = req.body.email;
//     try {
//         const findUser = await User.findOne({email:email});
//     if(!findUser)
//     {
//         //Create a new User
//         const newUser = await User.create(req.body);
//         res.json(newUser);
//     }
//     else
//     {
//         res.json({
//             msg : "User Already Exists",
//             success : false,
//         });
//     }
//     } catch (error) {
//         console.log("This is the error");
//         console.log(error);
//     }
//     // const findUser = await User.findOne({email:email});
//     // if(!findUser)
//     // {
//     //     //Create a new User
//     //     const newUser = await User.create(req.body);
//     //     res.json(newUser);
//     // }
//     // else
//     // {
//     //     res.json({
//     //         msg : "User Already Exists",
//     //         success : false,
//     //     });
//     // }
// };

//to login a user
const loginUserCtrl = asyncHandler(async (req,res)=>{
        const {email,password} = req.body;
        //console.log(email , password);
        const findUser = await User.findOne({email});
        if(findUser && (await findUser.isPasswordMatched(password))){
                const refreshToken = await generateRefreshToken(findUser?._id);

                const updateUser = await User.findByIdAndUpdate(
                        findUser.id,
                        {
                                refreshToken: refreshToken,

                        },
                        {
                                new:true,
                        }
                );
                res.cookie("refreshToken",refreshToken,{
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

//Handle refresh token
const handleRefreshToken = asyncHandler(async(req,res)=>{
        const cookie = req.cookies;
        console.log(cookie);
});
//update a user
const updateaUser = asyncHandler(async(req,res)=>{
        const {_id} = req.user;
        validateMongodbID(_id);
        try {
                const updateUser =await User.findByIdAndUpdate(
                        _id,
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
})

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
module.exports = { createUser,
         loginUserCtrl,
          getallUser,
          getaUser, 
          DeleteaUser,
           updateaUser,
           blockUser,
           unblockUser, 
           handleRefreshToken
};