import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/errorMiddleware.js"
import { User } from "../models/userSchema.js"
import { generateToken } from "../utils/jwtToken.js"
import cloudinary from "cloudinary"
import { config } from "dotenv";
config({ path: "./config/config.env" });
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");
const smtp_email = process.env.SMTP_EMAIL
import { transporter } from "../utils/sendmail.js";


export const sendVerifyLink=catchAsyncErrors(async(name,email,user_id)=>{
    
        const mailOptions = {
            from: smtp_email,
            to: email,
            subject: 'Verify your account',
            html:'<p>Hii '+name+','+ '<br></br>'+ 'Please click here to <a href="http://localhost:4000/api/v1/user/verify?id='+user_id+'" > verify you </a>'+'DeepCare Hospital'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending email:', error);
            }
            console.log('Email sent:', info.response);
        });


    

})





export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    let { firstName, lastName, email, phone, password, gender, role, dob ,isuserVerified} = req.body;
    console.log(req.body)
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob  || !role) {
        return next(new ErrorHandler("Please fill all required fields", 400))
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already exist", 400));
    }
    user = await User.create(
        {
            firstName, lastName, email, phone, password, gender, dob,  role,isuserVerified
        });
    sendVerifyLink(req.body.firstName,req.body.email,user._id);
    generateToken(user, "You are registered successfully", 200, res)
   
       
   
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password,  role } = req.body;
    if (!email || !password  || !role) {
        return next(new ErrorHandler("Please provide all details"), 400);
    }
   
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or email"), 400);
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or password"), 400);
    }
    if (role !== user.role) {
        return next(new ErrorHandler("User with this role not found"), 400);
    }
    generateToken(user, "Logged in successfully ", 200, res)

});
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob } = req.body
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob ) {
        return next(new ErrorHandler("Please fill all required field", 400))
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists`));
    }
    const admin = await User.create({ firstName, lastName, email, phone, password, gender, dob,  role: "Admin" })
    res.status(200).json({
        success: true,
        message: "New Admin registered successfully"
    })

})
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors
    })
})
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ role: "Patient" });
    res.status(200).json({
        success: true,
        users
    })
})

export const getuserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    })
});


export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("adminToken", "",
        {
            httpOnly: true,
            expires: new Date(Date.now())
        })
        .json({
            success: true,
            message: "Admin log out successfully...."
        })
});

export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("doctorToken", "",
        {
            httpOnly: true,
            expires: new Date(Date.now())
        })
        .json({
            success: true,
            message: "Doctor log out successfully...."
        })
});


export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken", "",
        {
            httpOnly: true,
            expires: new Date(Date.now())
        })
        .json({
            success: true,
            message: "Patient log out successfully...."
        })
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avtar required", 400))
    }
    const { docAvtar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvtar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
    const { firstName, lastName, email, phone, password, gender, dob,  doctorDepartment,doctorLicNumber } = req.body
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob  || !doctorDepartment ||!doctorLicNumber) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }
    const isRegistered = await User.findOne({ email })
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already exists with this email`, 400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvtar.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("cloudinary error", cloudinaryResponse.error || "unknown cloudinary error")

    }
    const doctor = await User.create({ firstName, lastName, email,doctorLicNumber, phone, password, gender, dob, doctorDepartment, role: "Doctor", 
    docAvtar:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
    },
    })
    res.status(200).json({
        success:true,
        message:"New doctor registered",
        doctor
    })
})

export const deleteUsers= catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    let user = await User.findById(id)
    console.log(user)
    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }
    await user.deleteOne()
    res.status(200).json({
        success: true,
        message: "User Deleted successfully"
    })
})

export const verifyMail=async(req,res,next)=>{
    try {
        
        const updateInfo= await User.updateOne({_id:req.query.id},{$set:{isuserVerified:true}})
        console.log(updateInfo);
        res.send("Verified successfully")
        
    } catch (error) {
        console.log(error.message)
    }
}