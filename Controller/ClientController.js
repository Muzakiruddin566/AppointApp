const clientAccount = require('../Model/ClientRegister');
const sendConfirmationEmail = require('./nodemail.confiq');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const clientRegister = async (req, res) => {
    const { name,number,gender,email,password,cPassword } = req.body;
    console.log(name,number,gender,email,password,cPassword)
    if (!name || !number || !gender || !email || !password || !cPassword) {
        return res.status(422).send("Input is Missing Name");
    }
    try {
        const clientExit = await clientAccount.findOne({ Email: email });
        if (clientExit) {
            console.log("Already Register");
            return res.status(400).send("User already registered. please Login");
        } else if (password !== cPassword) {
            console.log("Password Doesn't Match");
            return res.status(400).send("Password Doesn't Match.");
        } else {
            const varificationRandomCode = Math.floor(100000 + Math.random() * 900000)
            const Registered = new clientAccount({ Name:name,Number:number,Gender:gender,Email:email,password,confirmPassword:cPassword, varificationCode: varificationRandomCode });
            const DataSaved = await Registered.save();
            if (DataSaved) {
                res.status(201).send("User Resister Successfully");
                sendConfirmationEmail(Registered.Name, 'client',Registered.Email, Registered.varificationCode, Registered._id);
                console.log("Registered");
                console.log(DataSaved);
            }
        }
    }
    catch (error) {
        console.log("Error occur due to", error);
    }
}

const clientLogin = async (req,res)=>{
    const { email, password } = req.body;
    let token;
    if (!email || !password) {
        return res.status(400).send("Email Or password is InCorrect");
    } try {
        const clintExit = await clientAccount.findOne({ Email: email });
        if (clintExit) {
            const match = await bcrypt.compare(password, clintExit.password);
            if (!match) {
                console.log("Invalid Input")
                return res.status(400).send("Email Or password Invalid")
            }
            if(!clintExit.isVerified){
                return res.status(400).send("Please Verify your account Before Login. Please check your registered email! Thank You");
            }
            const jwtToken = await clintExit.generateAuthToken();
            // console.log(jwtToken);
            // console.log(clintExit);
            return res.status(201).json({
                "user_token":jwtToken
            });
        } else {
            console.log("Invalid  email");
            return res.status(400).send("Email Or password Invalid");
        }

    } catch (error) {
        console.log(error);
    }
}

const verificationCode = async(req,res)=>{
    const {code} = req.body;
    try {
        const Data = await clientAccount.findByIdAndUpdate(req.params.id);
        if(!Data){
            return res.status(400).send("invalid User!");
        }
        console.log(Data.varificationCode);
        if(Data.varificationCode === code ){
            Data.isVerified = true;
            await Data.save();
            return res.status(201).send("congratulation Now your account has verified.");
        }else{
            return res.status(400).send("Invalid Code Please Try again");
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    clientRegister,
    clientLogin,
    verificationCode
}