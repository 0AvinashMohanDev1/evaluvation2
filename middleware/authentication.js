const jwt=require("jsonwebtoken");
require("dotenv").config();

const {UserModel}=require("../modules/user.model");
const {blacklist}=require("../blacklist");

const authentication=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];

        if(blacklist.includes(token)){
            res.send("log in again");
            return;
        }

         jwt.verify(token,process.env.jwt_secret,(err,decoded)=>{
            console.log(decoded);
           let user= UserModel.findById(decoded.userID);
            console.log(user);
        //    if(err){
        //     res.send(err);
        //    }else{
        //     const {userID}=decoded;
        //     let user=UserModel.findById({_id:userID});
        //     console.log(userID,user.email)
        //     if(user){
        //         // console.log(user,"form if")
        //         req.user=user;
        //         next();
        //     }
        //     else{
        //         res.send("log in first")
        //     }
        //    }
        });
    }catch(err){
        console.log(err);
    }
}


const authrised=(permit)=>{
    return (req,res,next)=>{
      console.log(req.user.role)
        const role=req.user.role;
        if(permit.includes(role)){
            next();
        }else{
            res.send("unauthorised");
        }
    }
}


module.exports={
    authentication,
    authrised
}