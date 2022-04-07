const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const BarberSchema = new mongoose.Schema({
  BusinessName: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Number: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ConfirmPassword: {
    type: String,
    required: true,
  },
  shopImage: {
    type: String,
    required: true,
  },
  BarberShopForBoys: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  BeautySalonForGirl: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  BeautySalonForGirlsAndBoys: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  WeddingMakeupArtist: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  MakeupArtist: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  Massage: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  ShopStatus:{
    type:Boolean,
    required:true,
    default:false,
    enum:[true,false]
  },
  HomeServices: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  country: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  varificationCode: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  services: [
    {
      serviceName:String,
      servicePrice:String 
    },
  ],
  confirmToken: [
    {
      client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
      },
      tokenNumber:{type:Number,required:true},
      status:{type:String,required:true} 
    },
  ],

  appointment:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"appointment",
      required:true
    },
    
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  shopStatus:{
    type:String,
    default:"open"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// BarberSchema.methods.generateAuthToken = async function(){
// try {
//     const token = jwt.sign({_id:this._id.toString()},"Thismyzakiruddinhashmi1234567891");
//     this.tokens = this.tokens.concat({token:token});
//     console.log(token);
//     await this.save();
//     return token;
// } catch (error) {
//    console.log("Error part is",error);

// }
// console.log("hellp0pp");
// }
BarberSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.ConfirmPassword = await bcrypt.hash(this.ConfirmPassword, 12);
  }
  next();
});

BarberSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log("TOKEN ERROR", error);
  }
};

const BarberAccount = mongoose.model("Barber", BarberSchema);
module.exports = BarberAccount;
