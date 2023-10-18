const express = require("express"); 
const { createUser, loginUserCtrl } = require("../controller/userCtrl");

const router = express.Router();
router.post("/register",createUser); //route to register a user 
router.post("/login", loginUserCtrl);
module.exports = router;