const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    fullname:String,
    email:{type:String,unique:true},
    password:String,
    phoneNumber:String,
    accountNo:{type:Number,unique:true},
    balance:Number
},{ timestamps: true })
const userModel =mongoose.model('Customers',userSchema)
module.exports=userModel