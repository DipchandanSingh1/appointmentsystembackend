import mongoose from "mongoose";
import validator from "validator";
const messageSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First name must contain atleast 5 characters!"]

    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"Last name must contain atleast 5 characters!"]
        
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Please enter a valid email"]
        
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"phone no must contain atleast 10 Numbers"],
        maxLength:[13,"Not a valid phone number"]
        
    },
    message:{
        type:String,
        required:true,
        minLength:[10,"Message must contain 10 characters"]
        
    }
})

export const Message=mongoose.model("message",messageSchema)