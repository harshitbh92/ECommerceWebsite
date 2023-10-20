const express = require("express"); 
const { createUser, loginUserCtrl, getallUser, getaUser, DeleteaUser, updateaUser } = require("../controller/userCtrl");

const router = express.Router();
router.post("/register",createUser); //route to register a user 
router.post("/login", loginUserCtrl);//login a user
router.get("/all-users",getallUser);//get all users
router.get("/:id",getaUser);//get a single user
router.delete("/:id",DeleteaUser);//delete a user
router.put("/:id",updateaUser);//update a user
module.exports = router;