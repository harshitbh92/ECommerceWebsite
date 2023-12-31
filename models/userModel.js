//type !mdg and press enter to get basic Schema Structure
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const crypto =  require('crypto');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default :"user"
    },
    //to ckeck if a user is blocked
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart:{
        type : Array,
        default : []
    },
    address : {
        type : String,
    },
    wishlist : [ { type : mongoose.Schema.Types.ObjectId, ref : "Product"}],
    refreshToken :{
        type: String,
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
},
{
    timestamps : true,
});

//encrypt the password using bcrypt
userSchema.pre('save', async function(next){ //pre means that it will run before a 
    //document of the userSchema model is saved to the database
    //next(): This is a callback function that must be called at
    // the end of the middleware to signal that the middleware
    // has completed its task and the save operation can continue. 
    //It allows the document to proceed with the save operation,
    // ensuring that the hashed password is saved in the database.

    if(!this.isModified("password")){
        //for the update password if password is modified then we nwwd to encrypt it 
        //if not modified no need to encrypt hence "next()""
        next();
    }

    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//now to ckeck the enetered password to original decrypt it
userSchema.methods.isPasswordMatched = async function(enteredPassword){ //adds method isPasswordMatched to the userSchema
    return await bcrypt.compare(enteredPassword, this.password);
};


//-------For Forgot Password----
//it generates a random password reset token, hashes it, stores it in the user model along with an expiration timestamp, 
//and returns the unhashed token for potential use in communication with the user
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    //this line generates a random 32bit string which is converted to hexadecimal and this will be used 
    //as actual token for reset of the password
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest("hex");
    //creates a hash object for the sha-256 algo and the updates this object with the resetToken
    this.passwordResetExpires = Date.now() + 30*60*1000; //10 minutes
    //This line sets the passwordResetExpires field to a timestamp representing the expiration time of the password reset token
    return resetToken;
}

//Export the model
module.exports = mongoose.model('User', userSchema);