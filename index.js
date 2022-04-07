const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const BarberRouter = require('./Router/BarberRouter'); 
const ClientRouter = require('./Router/ClientRouter');
const app = express();
require('./DataBase/db.connect');
// console.log(process.env.DB_URI);
const port = 4000;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
// For Barber Account
app.use('/Barber',BarberRouter);
// For Client Account
app.use('/client',ClientRouter);
app.listen(port, ()=>{
    console.log(`Server start with http://localhost:${port}`)
})