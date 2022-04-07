const jwt = require('jsonwebtoken');
const BarberAccount = require("../Model/BarberRegister");
const cookieParser = require("cookie-parser");
const authMiddleware = async (req,res,next)=>{
    try {
        const token = req.cookies.jwtToken;
        const  verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        const Barber = await BarberAccount.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!Barber){
            throw new Error("Please login ");
        }
        req.token = token;
        req.BarberData = Barber;
        next();
        
    } catch (error) {
        res.status(401).send("Unauthorized User!");
        console.log(error);
    }
}
module.exports = authMiddleware;