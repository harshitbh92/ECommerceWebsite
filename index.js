const express = require('express'); //for importing express
const dbConnect = require('./config/dbConnect'); //for importing config folder ka dbconnect
const app=express();  // express app
const dotenv=require('dotenv').config(); //.env file
const PORT=process.env.PORT || 4000; //port define
const authRouter = require("./routes/authRoute");
const bodyParser = require("body-parser")

dbConnect(); // connecting DB as exported from config>dbConnect.js

app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data


app.use("/",(req,res)=>{
    res.send("Hello from Server");
});

app.use("/api/user",authRouter);//hiii

app.listen(PORT,()=>{
    console.log("Server is running at port " +PORT);
});