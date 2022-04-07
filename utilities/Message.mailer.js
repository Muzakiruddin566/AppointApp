const nodemailer = require('nodemailer');


const sendMessageToBarber = (userEmail,userPassword,BarberEmail,message)=>{
    const transport = nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:userEmail,
            pass:userPassword
        }
    });
    transport.sendMail({
        from:userEmail,
        to:BarberEmail,
        subject: "Client want your time!",
        html:`${message}`
    }).catch(error=>{
        console.log(error);
    });


}

module.exports = sendMessageToBarber