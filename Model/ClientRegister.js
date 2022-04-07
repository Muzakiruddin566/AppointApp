const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const clientRegister = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Number:{
        type:String,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    varificationCode:{
        type:Number,
        required:true     
    },
    isVerified:{
        type:Boolean,
        enum:[true,false],
        default:false
    },
    tokens:[
        {
            token:
            {
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

clientRegister.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcryptjs.hash(this.password,12);
        this.confirmPassword = await bcryptjs.hash(this.confirmPassword,12);
    }
    next();
}); 

clientRegister.methods.generateAuthToken = async function(){
    try{
        const token = jsonwebtoken.sign({_id:this._id},process.env.Client_SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch{
        console.log("TOKEN ERROR",error);
    }
}


const clientAccount = mongoose.model("user",clientRegister);
module.exports = clientAccount;