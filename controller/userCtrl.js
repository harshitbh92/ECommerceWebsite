//LOGIN CONTROLLER
//require user models
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
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

const loginUserCtrl = asyncHandler(async (req,res)=>{
        const {email,password} = req.body;
        //console.log(email , password);
        const findUser = await User.findOne({email});
        if(findUser && (await findUser.isPasswordMatched(password))){
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
module.exports = { createUser, loginUserCtrl };