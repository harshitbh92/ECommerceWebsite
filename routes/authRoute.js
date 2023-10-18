const express = require("express"); 
const router = express.Router();
const {createUser} = require("../controller/userCtrl")

router.post("/register",createUser); //route to register a user 
module.exports = router;