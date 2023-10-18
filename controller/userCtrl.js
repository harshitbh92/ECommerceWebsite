//require user models
const User = require("../models/userModel");

//create new users
const createUser = async (req, res) => {
    //if user already exists or a new User
    const email = req.body.email;
    try {
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            //Create a new User
            const newUser = User.create(req.body);
            res.json(newUser);
        }
        else {
            res.json({
                msg: "User Already Exists",
                success: false,
            });
        }

    } catch (error) {
        console.log(error)
    }
};

module.exports = { createUser };