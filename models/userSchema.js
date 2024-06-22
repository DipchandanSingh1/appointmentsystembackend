import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First name must contain atleast 3 characters!"],
        maxLength:[10,"Max length exceeded for firstname"]


    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"Last name must contain atleast 3 characters!"],
        maxLength:[10,"Max length exceeded for lastname"]
        
    },
    doctorLicNumber:{
        type:String,
        
        minLength:[5,"Doctor medical council registration number must be 5 digit"]
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
    dob:{
        type:Date,
        required:[true,"DOB is required"],

    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female","Others"],
    },
    password:{
        type:String,
        minLength:[8,"Password must contain 8 characters"],
        required:true,
        select:false
    },
    role:{
        type:String,
        required:true,
        enum:["Admin","Patient","Doctor"],

    },
    address:{
        type:String,
        minLength:[5,"Please enter at least 3 character"],
        maxLength:[200,"Exceeded max length"]

    },
    doctorDepartment:{
        type:String
    },
    docAvtar:{
        public_id:String,
        url:String,
    },
    isuserVerified:{
        type:Boolean,
        default:false
    }


})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
});

userSchema.methods.comparePassword=async function(entererdPassword){
    return await bcrypt.compare(entererdPassword,this.password);

};
userSchema.methods.generateJsonWebToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,
    {expiresIn:process.env.JWT_EXPIRES,
    })
}

export const User=mongoose.model("user",userSchema)