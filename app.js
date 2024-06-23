import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnections.js";
import messageRouter from "./routes/messageRoutes.js";
import appointmentRouter from "./routes/appointmentRoute.js";
import {errorMiddleware} from './middleware/errorMiddleware.js '
import userRouter from "./routes/userRoutes.js"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app=express();
const fs = require('fs');
const path = require('path');
config({path:"./config/config.env"});

app.use(cors({
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL,process.env.DOCTORDASHBOARD_URL],
    methods:["GET","HEAD","PUT","post","PATCH","POST","DELETE"],
    credentials: true
}));

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(fileUpload({
//     useTempFiles:true,
//     tempFileDir:"/temp/",

// }))

const tempDir = '/tmp'; // Use a safe, existing directory

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/' // Update this to the correct path
  }));



app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/appointment",appointmentRouter);
dbConnection()
app.use(errorMiddleware)
export default app