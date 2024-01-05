const express = require("express"); 
const { createUser, loginUserCtrl, getallUser, getaUser, DeleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logoutauser, updatePassword, forgotPasswordToken, resetPassword, adminLogin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); //middlewares

const router = express.Router();
//router.post("url path", "callback function")
router.post("/register",createUser); //route to register a user 
router.post("/login", loginUserCtrl);//login a user
router.post("/adminlogin",adminLogin);//admin Login
router.post("/cart" ,authMiddleware, userCart);//add to cart
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.get("/cart",authMiddleware,getUserCart);//get a user's cart
router.get("/all-users",getallUser);//get all users
router.get("/refresh",handleRefreshToken);//handling refresh token
router.get("/logout",logoutauser);
router.get("/wishlist",authMiddleware,getWishlist);
router.get("/:id",authMiddleware,isAdmin, getaUser);//get a single user
router.delete("/emptycart",authMiddleware,emptyCart);//empty cart
router.delete("/:id",DeleteaUser);//delete a user
router.put("/edit-user",authMiddleware,updateaUser);//update a user
router.put("/save-address",authMiddleware,saveAddress);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);
router.put("/password",authMiddleware,updatePassword);
router.post("/forgot-password-token",forgotPasswordToken);
router.put("/reset-password/:token",resetPassword);

module.exports = router;