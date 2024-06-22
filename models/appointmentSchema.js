import mongoose from "mongoose";
import validator from "validator";


const appointmentSchema=new mongoose.Schema({
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
        validate:[validator.isEmail,"Please provide a valid email"]
        
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"phone no must contain atleast 10 Numbers"]
        
    },
   
    symptoms:{
        type:String,
        maxLength:[255,"Symptoms exceeded max lenght of word"]
    },

    dob:{
        type:Date,
        required:[true,"DOB is required"],

    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"],
    },
    appointment_date:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    doctor:{
       firstName:{

       },
       lastName:{
        type:String,
        required:true
       } 
    },
    hasVisited:{
        type:Boolean,
        default:false
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    }

})

export const Appointment=mongoose.model("Appointment",appointmentSchema)