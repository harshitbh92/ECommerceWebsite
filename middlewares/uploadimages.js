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

const mulerFilter = (req,file,cb)=>{
    if(file.mimeType.startswith("image"))
    {
        cb(null,true);
    }else{
        cb(
            {
            message : "Unsupported File Format",
            },
            false
        );
    }
};


const uploadPhoto = multer({
    storage : mulerStorage,
    fileFilter : mulerFilter,
    limlits : { fieldSize : 2000000 }
});


//resize the image and ssave it in the directory
const productImgResize = async(req,res,next)=>{
    if(!req.files)
    {
        return next();
    }
    await Promise.all(
        req.files.map(async (file)=>{
            await sharp(file.path)
            .resize(300,300)
            .toFormat("jpeg")
            .jpeg({quality : 90})
            .toFile(`public/images/products/${file.filename}`);
        })
    );
    next();
};

const blogImgResize = async(req,res,next)=>{
    if(!req.files)
    {
        return next();
    }
    await Promise.all(
        req.files.map(async (file)=>{
            await sharp(file.path)
            .resize(300,300)
            .toFormat("jpeg")
            .jpeg({quality : 90})
            .toFile(`public/images/blogs/${file.filename}`);
        })
    );
    next();
};


module.exports = {
    uploadPhoto,
    productImgResize,
    blogImgResize

}