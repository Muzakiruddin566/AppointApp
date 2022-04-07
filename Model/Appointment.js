const mongoose = require("mongoose");
const appointSchema = new mongoose.Schema({
    barber:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Barber',
            required:true
        }
    ],
    client:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        }
    ],
    tokenNumber:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true
    }
});

const appointModel  = mongoose.model('appointment',appointSchema);
module.exports = appointModel;