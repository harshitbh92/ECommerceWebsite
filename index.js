const express = require('express'); //for importing express
const dbConnect = require('./config/dbConnect'); //for importing config folder ka dbconnect
const app=express();  // express app
const dotenv=require('dotenv').config(); //.env file
const PORT=process.env.PORT || 4000; //port define
const authRouter = require("./routes/authRoute");
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// async () => {
//     await dbConnect();
// };
// //();
dbConnect(); // connecting DB as exported from config>dbConnect.js
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/user", authRouter);

//middlewares after auth
app.use(notFound);
app.use(errorHandler);

// app.use("/",(req,res)=>{
//     res.send("Hello from Server");
// });

app.listen(PORT,()=>{
    console.log("Server is running at port " +PORT);
});