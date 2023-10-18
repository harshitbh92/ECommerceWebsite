const { default: mongoose } = require("mongoose")

const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL).then(() => {
            console.log("Connected to database")
        }).catch(err => {
            console.log("Unable to connect to database",err)
        })
    }
    catch(error){
        console.log("Unexpected error");
    }
};
module.exports = dbConnect;