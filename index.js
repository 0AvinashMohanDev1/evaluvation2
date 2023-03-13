const express=require("express");
const {connection}=require("./modules/db");
const {UserModel}=require("./modules/user.model");
const {productModel}=require("./modules/product.model")
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {blacklist}=require("./blacklist");
const {authentication,authrised}=require("./middleware/authentication")
require("dotenv").config();

const app=express();
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("HOME PAGE");
})


app.post("/signup",async(req,res)=>{
//     try{
//         let userID=req.body;
// console.log(userID);
//         let user=await UserModel.findOne({"email":userID.email});
//         console.log(user);
//         if(user){
//             res.send("user already registerd");
//             return;
//         }
//         userID.password=await bcrypt.hashSync(userID.password,5)
//         console.log(userID);
//         user=await new UserModel(userID);
//         console.log(userID)
//         await user.save();
//         res.send("account created");
//     }catch(err){
//         res.send(err);
//     }
try{
    let userId=req.body;
    let user=await UserModel.findOne({email:userId.email});
    // console.log(userId);
    if(user){return res.send("user already resistered")};
    
    bcrypt.hashSync(userId.passsword,7,(err,hashed)=>{
        if(err){return res.send(err.message)}
        userId.password=hashed
        user= new UserModel(userId);
        user.save();
        res.send({"msg":"new user added"});
    });
    
}catch(err){
    res.send(err.message);
}
    // res.send("working")
    
})


app.post("/login",async(req,res)=>{
    try{
        let userid=req.body;
        console.log(userid);
        let present=await UserModel.findOne({"email":userid.email});
        // console.log(present);
        if(!present){
            res.send("please signup first")
            return;
        }
        bcrypt.compare(userid.password,present.password,(err,result)=>{
            if(result){
                let token=jwt.sign({userID:present._id},process.env.jwt_secret,{expiresIn:60});
                let refreshtoken=jwt.sign({userID:present._id},process.env.jwt_refresh_secret,{expiresIn:300})
                res.send({msg:"logged in",token,refreshtoken})
            }else{
                console.log(err);
            }
        })
    }catch(err){
        res.send(err);
    }
})

app.get("/logout",(req,res)=>{
    let token=req.headers.authorization.split(" ")[1];
    if(!token){return res.send("please log in first")};
    
    blacklist.push(token);
    res.send("logged out");

})

app.get("/product",authentication,authrised(["customer"]),(req,res)=>{
    res.send("all products here");
})

app.post("/addproducts",authentication,authrised(["seller"]),async(req,res)=>{
    // let product=req.body;
    // product=await new productModel(product);
    // await product.save();
    res.send("added product");
})

app.delete("/deleteproducts/:id",authentication,authrised(["seller"]),async(req,res)=>{
    await productModel.findByIdAndDelete(req.params.id);
    res.send("product deleted");
})

app.get("/refresh",(req,res)=>{
    let token=req.headers.authorization.split(" ")[1];
    token=jwt.verify(token,process.env.jwt_refresh_secret)
    res.send({token});
})

app.listen(8000,async(req,res)=>{
try{
    await connection;
    console.log("working at 8000");
}catch(err){
    console.log({err});
}
})