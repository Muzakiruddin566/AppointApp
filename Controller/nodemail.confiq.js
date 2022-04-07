const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const user = process.env.EMAIL;
const pass = process.env.PASSWORD;

const transport = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:user,
        pass:pass
    }
})

const sendConfirmationEmail = (name,account, email, confirmationCode,id) => {
    console.log("Check");
    transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<div>
                <h3 style="color:white">Email Confirmation</h3>
                <p >Hello ${name}</p>
                <p >Thank you for Register. Please confirm your email by clicking on the following link <br/> and Enter Following code</p>
                <a href=http://localhost:3000/${account}/verificationCode/${id}> Click here</a>
                <h3 ><strong>${confirmationCode}</strong></h3>
            </div>`
    }).catch(err => console.log(err));
  };

  module.exports = sendConfirmationEmail