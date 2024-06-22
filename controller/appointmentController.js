
import { catchAsyncErrors } from "../middleware/catchAsyncError.js"
import { ErrorHandler } from "../middleware/errorMiddleware.js"
import { Appointment } from "../models/appointmentSchema.js"
import { User } from "../models/userSchema.js"
import { config } from "dotenv";
config({ path: "./config/config.env" });
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");
import { transporter } from "../utils/sendmail.js";
//twilio account setting
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
// console.log(TWILIO_ACCOUNT_SID)
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const smtp_email = process.env.SMTP_EMAIL
const smtp_password = process.env.SMTP_PASSWORD
const client = require('twilio')(accountSid, authToken);

//nodemailer setting
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body)
    const { firstName, lastName, email, phone, dob, gender, appointment_date, department, doctor_firstName, doctor_lastName, hasVisited, address, symptoms, prevMedication } = req.body;
    if (!firstName || !lastName || !email || !phone || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName || !address || !symptoms) {
        return next(new ErrorHandler("Please fill all the requireds fileds"))
    }
    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department
    });
    if (isConflict.length === 0) {
        return next(new ErrorHandler("Doctor not found", 404));
    }
    if (isConflict.length > 1) {
        return next(new ErrorHandler("Doctor conflit found please contact through phone or email", 404));
    }
    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({
        firstName, lastName, email, phone, dob, gender, appointment_date, department, doctor: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        }, hasVisited, address, doctorId, patientId,symptoms
    });

    res.status(200).json({
        success: true,
        message: "Appointment sent successfully....",
        appointment
    })
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        appointments,
    })
});

export const getAllUserAppointments = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    // console.log(user)
    const appointments = await Appointment.find();
    let appointmentObj = { ...appointments }
    if (user.email) {
        let data = []
        for (let i in appointmentObj) {
            if (appointmentObj[i].email == user.email) {
                data.push(
                    appointmentObj[i]
                )
            }
        }
        res.status(200).json({
            success: true,
            data,
        })
    }

});

export const getDoctorAppointments = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    // console.log(user)
    const appointments = await Appointment.find();
    let appointmentObj = { ...appointments }
    if (user.doctorDepartment) {
        let data = []
        for (let i in appointmentObj) {
            if (appointmentObj[i].department == user.doctorDepartment) {
                data.push(
                    appointmentObj[i]
                )
            }
        }
        res.status(200).json({
            success: true,
            data,
        })
    }

});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
    let {status,userEmail,phone}=req.body
    console.log(userEmail)
    //handling email and sms testing
    if (userEmail && status!=="Pending") {
        const mailOptions = {
            from: smtp_email,
            to: userEmail,
            subject: 'Deepcare Hospital',
            html:'<p>Hii, your appointment has been  </>'+status +'<br/>'+'DeepCare Hospital,Shantinagar'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending email:', error);
            }
            console.log('Email sent:', info.response);
        });

        //sms tesing
        const sendSms = async (to, from, body) => {
            try {
                const message = await client.messages.create({
                    to: `+977`+phone,
                    from: process.env.TWILIO_FROM_NUMBER,
                    body: "Appointment is " + status + " From DeepCare"
                });
                console.log(`Message sent with SID: ${message.sid}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        };
        sendSms()

    } else {
        console.log("rejected")
    }

    //handling sms end

    // console.log(status)
    const { id } = req.params
    let appointment = await Appointment.findById(id)
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404))
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        message: "Appointment status updated successfully.....",
        appointment
    })
})

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    let appointment = await Appointment.findById(id)
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 400))
    }
    await appointment.deleteOne()
    res.status(200).json({
        success: true,
        message: "Appointment Deleted successfully"
    })
})