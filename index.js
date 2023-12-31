const express = require('express'); //for importing express
const dbConnect = require('./config/dbConnect'); //for importing config folder ka dbconnect
const app=express();  // express app
const dotenv=require('dotenv').config(); //.env file
const PORT=process.env.PORT || 4000; //port define
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require('./routes/blogRoute');
const ProdcategoryRouter = require('./routes/ProdcategoryRoute');
const BlogCategoryRouter = require("./routes/BlogCatRoute");
const BrandRouter = require("./routes/brandRoute");
const CouponRouter = require("./routes/couponRoute");
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // to see a requests made in the console.
// async () => {
//     await dbConnect();
// };
// //();
dbConnect(); // connecting DB as exported from config>dbConnect.js
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//for User 
app.use("/api/user", authRouter);
//for Product 
app.use("/api/product",productRouter);
//for Blog
app.use("/api/blog", blogRouter);
//for prod category
app.use("/api/category",ProdcategoryRouter);
//for blog category
app.use("/api/blogcategory",BlogCategoryRouter);
//for Brand 
app.use("/api/brand",BrandRouter);
//for Coupon
app.use("/api/coupon",CouponRouter);



//middlewares after auth
app.use(notFound);
app.use(errorHandler);

// app.use("/",(req,res)=>{
//     res.send("Hello from Server");
// });

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);

});