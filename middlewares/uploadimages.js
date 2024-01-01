const multer = require("multer");
//multer is a popular middleware for handling multipart/form-data, 
//which is often used when working with file uploads
const sharp = require("sharp");
const path = require("path");

//how files are stord on server
const mulerStorage  = multer.diskStorage({
    destination : function(req,file,cb)//cb is a callback function
    {
        cb(null,path.json(__dirname,"../public/images")); // path where the destination file will be stored
    }, 
    filename : function(req,file,cb)
    {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() *1e9);
        cb(null , file.fieldname + "-" +uniqueSuffix + ".jpeg"); 
        //unique filename -> originalfilename + date + as random number
    }
});

