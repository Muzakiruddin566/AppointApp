const jwt = require('jsonwebtoken');
const clientAccount = require("../Model/ClientRegister");
const cookieParser = require("cookie-parser");

const clientAuthMiddleware = async(req,res,next)=>{
    try {
        const user_Token = req.cookies.user_Token;
        const verify = jwt.verify(user_Token,process.env.Client_SECRET_KEY);
        const clientData = await clientAccount.findOne({_id:verify._id,"tokens.token":user_Token});
        if(!clientData){
            throw new Error("Please login ");
        }
        req.token = user_Token;
        req.userData = clientData;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized User!");
        console.log(error);
    }
}
module.exports = clientAuthMiddleware;