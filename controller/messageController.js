import{Message} from "../models/messageSchema.js"
import{catchAsyncErrors} from "../middleware/catchAsyncError.js"
import { ErrorHandler } from "../middleware/errorMiddleware.js";

export const sendMessage=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,message}=req.body;
    if(!firstName || !lastName || !email || !phone || !message){
        return next(new ErrorHandler("Please fill all form fields",400))
    }
    await Message.create({firstName,lastName,phone,email,message});
    res.status(200).json({
        success:true,
        message:"Message send successfully",
    });
})


export const getAllMessages=catchAsyncErrors(async(req,res,next)=>{
    const messages=await Message.find();
    res.status(200).json({
        success:true,
        messages,
    })
})