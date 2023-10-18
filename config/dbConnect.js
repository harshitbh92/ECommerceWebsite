const { default: mongoose } = require("mongoose")

const dbConnect = ()=>{
    try{
        console.log("This is the URL",process.env.MONGODB_URL);
        const conn=  mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully");
    }
    catch(error){
        console.log("Database Error");
    }
};
module.exports = dbConnect;