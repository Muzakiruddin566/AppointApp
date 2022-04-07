const express = require('express');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const clientAuthMiddleware = require('../Middleware/clientAuthMiddleware');
const BarberAccount = require('../Model/BarberRegister');
const {BarberRegister,getClientAppointmentsController,getAllServiceController,completeTaskController,getUpcomingAppointmentController,appointmentController,getAppointmentController,getBarberController,DisplayBarberController,handleAddServiceController,BarberVerificationController,BarberLoginController} = require('../Controller/BarberRegister');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../TheBarberplus/public/ShopImages/uploads/')
      
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,   uniqueSuffix +  '-' +file.originalname )
    }
})

const upload = multer({  storage: storage })

// Display All Barber Project 
router.get('/',DisplayBarberController);

router.post('/Register',upload.single('ShopImage'),BarberRegister);
// For verification /
router.put('/varificationCode/:id',BarberVerificationController);
// For login

router.put('/addServices/:id',handleAddServiceController);

router.post('/login',BarberLoginController);

// Get Specific Barber Information
router.get('/BarberPost/:id',clientAuthMiddleware,getBarberController);

router.get('/allServices',authMiddleware,getAllServiceController);

// Auth


router.get('/portal',authMiddleware,(req,res)=>{
  res.send(req.BarberData);
  // res.json({"Data":req.BarberData});
});
router.post('/Message',(req,res)=>{
  const {password,message,userEmail,baberEmail} = req.body;
  try {
    const transport = nodemailer.createTransport({
      service:"Gmail",
      auth:{
        user:userEmail,
        pass:userPassword
      }
    });
    transport.sendMail({
      from:userEmail,
      to:baberEmail,
      subject: "Client want your time!",
      html:`${message}`
    })
    res.status(201).send("sent");  
  } catch (error) {
    res.status(535).send("Invalid password");
  }
  
});


router.put('/appointment/:id',clientAuthMiddleware,appointmentController)
router.put('/completeTask/:barberId/:id',completeTaskController)
router.get('/getAppointment',authMiddleware,getAppointmentController);

router.get('/upcomingAppointment',authMiddleware,getUpcomingAppointmentController);
router.get('/client/Appointments',clientAuthMiddleware,getClientAppointmentsController);

module.exports = router;