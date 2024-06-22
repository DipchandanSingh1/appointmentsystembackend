import mongoose, { mongo } from "mongoose";
export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:"HOSPITAL_MANAGEMENT_SYSTEM",
    })
    .then(()=>{
        console.log("Database connected successfully")
    })
    .catch((err)=>{
        console.log("Some error occured while making connection with database"+err)
    })
}