const mongoose=require("mongoose");

// const userSchema=mongoose.Schema({
//     "email":{type:String,required:true},
//     "password":{type:String,required:true},
//     "role":{
//         type:String,
//         required:true,
//         default:"customer"
//     }
// })
const userSchema=mongoose.Schema({
    "email":String,
    "password":String,
    "role":{
        type:String,
        required:true,
        default:"customer"
    }
})

const UserModel=mongoose.model("/user",userSchema);


module.exports={
    UserModel
}