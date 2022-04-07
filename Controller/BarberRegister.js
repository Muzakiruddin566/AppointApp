const BarberAccount = require("../Model/BarberRegister");
const sendConfirmationEmail = require("./nodemail.confiq");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientAccount = require("../Model/ClientRegister");
const appointModel = require('../Model/Appointment');
// Barber Login

// Register  the Barber Barber
const BarberRegister = async (req, res) => {
  const shopImage = req.file ? req.file.filename : null;
  const {
    BusinessName,
    Name,
    Number,
    Email,
    password,
    ConfirmPassword,
    BarberShopForBoys,
    BeautySalonForGirl,
    BeautySalonForGirlsAndBoys,
    WeddingMakeupArtist,
    MakeupArtist,
    Massage,
    HomeServices,
    city,
    country,
    region,
    lat,
    long,
    postal_code,
  } = req.body;
  if (
    !BusinessName ||
    !Name ||
    !Number ||
    !Email ||
    !password ||
    !ConfirmPassword ||
    !city ||
    !country ||
    !region ||
    !lat ||
    !long ||
    !postal_code
  ) {
    return res.status(422).send("Input is Missing");
  }
  try {
    const barberExit = await BarberAccount.findOne({ Email: Email });
    if (barberExit) {
      console.log("Already Register");
      return res.status(400).send("User already registered.");
    } else if (password !== ConfirmPassword) {
      console.log("Password Doesn't Match");
      return res.status(400).send("Password Doesn't Match.");
    } else {
      const varificationRandomCode = Math.floor(
        100000 + Math.random() * 900000
      );
      const Registered = new BarberAccount({
        BusinessName,
        Name,
        Number,
        Email,
        password,
        ConfirmPassword,
        shopImage,
        BarberShopForBoys,
        BeautySalonForGirl,
        BeautySalonForGirlsAndBoys,
        WeddingMakeupArtist,
        MakeupArtist,
        Massage,
        HomeServices,
        city,
        country,
        region,
        latitude: lat,
        longitude: long,
        postalCode: postal_code,
        varificationCode: varificationRandomCode,
      });
      const DataSaved = await Registered.save();
      if (DataSaved) {
        res.status(201).send("Barber Resister Successfully");
        sendConfirmationEmail(
          Registered.Name,
          "Barber",
          Registered.Email,
          Registered.varificationCode,
          Registered._id
        );
        console.log("Registered");
      }
    }
  } catch (error) {
    console.log("Error occur due to", error);
  }
};

// Generate Verification Code

const BarberVerificationController = async (req, res) => {
  const { code } = req.body;
  try {
    const Data = await BarberAccount.findByIdAndUpdate(req.params.id);
    if (Data) {
      if (Data.varificationCode === code) {
        Data.isVerified = true;
        await Data.save();
        return res.status(201).send("Varification Successfully");
      } else {
        console.log("Not Valid");
        return res.status(201).send("Invalid Code");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Login the Barber
const BarberLoginController = async (req, res) => {
  const { email, password } = req.body;
  let token;
  if (!email || !password) {
    return res.status(400).send("Email Or password is InCorrect");
  }
  try {
    const barberExit = await BarberAccount.findOne({ Email: email });
    if (barberExit) {
      // console.log(barberExit);
      const match = await bcrypt.compare(password, barberExit.password);
      if (!match) {
        console.log("Invalid Input");
        return res.status(400).send("Email Or password Invalid");
      }
      const jwtToken = await barberExit.generateAuthToken();
      console.log(jwtToken);
      console.log(barberExit);
      return res.status(201).json({
        token: jwtToken,
      });
    } else {
      console.log("Invalid email");
      return res.status(400).send("Email Or password Invalid");
    }
  } catch (error) {
    console.log(error);
  }
};
// Display All Barber List
const DisplayBarberController = async (req, res) => {
  try {
    const Barbers = await BarberAccount.find();
    if (!Barbers) {
      return res.status(204).send("No Content");
    }
    res.status(201).send(Barbers);
  } catch (error) {
    console.log(Error);
    return res.status(500).send("Server Error");
  }
};

const getBarberController = async (req, res) => {
  try {
    const getBarber = await BarberAccount.findById(req.params.id);
    if (!getBarber) {
      return res.status(204).send("invalid ID");
    }
    res.status(201).json({ BarberData: getBarber, clientData: req.userData });
  } catch (error) {
    console.log(error);
  }
};

const handleAddServiceController = async (req, res) => {
  console.log(req.params.id);
  const { service, price } = req.body;
  console.log(service, price);
  try {
    const Barber = await BarberAccount.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          services: {
            serviceName: service,
            servicePrice: price,
          },
        },
      },
      { new: true }
    );
    console.log(Barber);
    return res.status(201).send("Add successfully");
  } catch (error) {
    console.log(error);
  }
};

const getAllServiceController = async (req, res) => {
  try {
    const getBarber = await BarberAccount.findById(req.BarberData._id);
    if (!getBarber) {
      return res.status(204).send("invalid ID");
    }
    res.status(201).send(getBarber);
  } catch (error) {
    console.log(error);
  }
};

const appointmentController = async (req, res) => {
  try {
    let appointments;
    const barber = await BarberAccount.findOne({_id:req.params.id})
    
      if(barber.confirmToken.length <= 5){
        barber.confirmToken.push({
          client:req.userData._id,
          tokenNumber:barber.confirmToken.length+1,
          status:"confirm"
        });
         appointments = new appointModel({
          barber:barber._id,
          client:req.userData._id,
          tokenNumber:barber.confirmToken.length+1,
          status:"confirm"
        });
        const save = await appointments.save();
        if(save){
          barber.appointment.push(save._id);
        }
        res.status(201).send(`Your Token is ${barber.confirmToken.length} `);
        console.log("appoinment Confirmed");
        console.log(appointments);
      }else{
        barber.confirmToken.push({
          client:req.userData._id,
          tokenNumber:barber.confirmToken.length+1,
          status:"waiting"
        });
         appointments = new appointModel({
          barber:barber._id,
          client:req.userData._id,
          tokenNumber:barber.confirmToken.length,
          status:"waiting"
        });
        await appointments.save();
        const save = await appointments.save();
        if(save){
          barber.appointment.push(save._id);
        }
        res.status(201).send(`Your Token is ${barber.confirmToken.length} `);
        console.log("appoinment Confirmed");
        console.log(appointments);
      }
    // console.log(appointments._id)
    
    await barber.save();
    console.log(barber);
  } catch (error) {
    console.log(error);
  }
};

const getAppointmentController = async (req, res) => {
  try {
    
    const barber = await BarberAccount.findById(req.BarberData).populate({
      path:'confirmToken.client',
      model:"user",
      select:['Name','Number','Email','Gender']
    });
    if (!barber) {
      return res.status(401).send("Invalid User");
    }
    res.status(201).send(barber);
    
    
    
  } catch (error) {
    console.log(error);
  }
};

const getUpcomingAppointmentController = async (req,res)=>{
  try {
    const barber = await BarberAccount.findById(req.BarberData);
    if (!barber) {
      return res.status(401).send("Invalid User");
    }
    res.status(201).send(barber);
  } catch (error) {
    console.log(error);
  }
}

const completeTaskController = async(req,res)=>{
  try {
    const completeTask = await BarberAccount.findOneAndUpdate(
      {_id:req.params.barberId},
      {$pull:{
        confirmToken:{
          _id:req.params.id
        }
      }},
      { safe: true, multi: false }
      );
    const update = await BarberAccount.updateOne({'confirmToken.status':"waiting"},{$set:{
      'confirmToken.$.status':'confirm'
    }});
    console.log(update);
    res.status(201).send("Customer Free");
  } catch (error) {
    console.log(error);
  }
}

const getClientAppointmentsController = async (req,res)=>{
  try {
    const appointment = await appointModel.find({client:req.userData._id}).populate({
      path:'barber',
      model:"Barber",
      select:['Name','Number','Email']
    });
    if(!appointment){
      return res.status(204).send('No content');
    }
    return  res.status(201).json({
      "Data":appointment
    }); 
    // console.log('%j', appointment);
    // console.log(appointment);
  } catch (error) {
    console.log(error);
  }
   
}



module.exports = {
  BarberRegister,
  BarberVerificationController,
  BarberLoginController,
  DisplayBarberController,
  getBarberController,
  handleAddServiceController,
  getAllServiceController,
  appointmentController,
  getAppointmentController,
  getUpcomingAppointmentController,
  completeTaskController,
  getClientAppointmentsController
};
