const express = require("express"); 
const { createUser, loginUserCtrl, getallUser, getaUser, DeleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware"); //middlewares

const router = express.Router();
//router.post("url path", "callback function")
router.post("/register",createUser); //route to register a user 
router.post("/login", loginUserCtrl);//login a user
router.get("/all-users",getallUser);//get all users
router.get("/:id",authMiddleware,isAdmin, getaUser);//get a single user
router.delete("/:id",DeleteaUser);//delete a user
router.put("/edit-user",authMiddleware,updateaUser);//update a user
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);
router.get("/refresh",handleRefreshToken);//handling refresh token
module.exports = router;