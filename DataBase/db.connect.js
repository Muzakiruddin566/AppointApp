const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
mongoose.connect(process.env.LOCALHOST_DB).then(()=>{
    console.log("DataBase Connect Successfully !");
}).catch((error)=>{
    console.log("Error",error);
});
