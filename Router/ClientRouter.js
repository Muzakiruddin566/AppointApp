const express = require('express');
const router = express.Router();
const {clientRegister,clientLogin,verificationCode} = require('../Controller/ClientController');
const clientAuthMiddleware  = require('../Middleware/clientAuthMiddleware');
router.post('/register',clientRegister);
router.post('/login',clientLogin);
router.put('/verificationCode/:id',verificationCode)
router.get('/portal',clientAuthMiddleware,(req,res)=>{
    console.log(req.userData);
    res.status(201).send(req.userData);
})
module.exports = router;