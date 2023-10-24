const mongoose = require("mongoose");
const validateMongodbID = (id) =>{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid){
        throw new Error("This id is not valid or Not Found");
    }

}

module.exports ={validateMongodbID};