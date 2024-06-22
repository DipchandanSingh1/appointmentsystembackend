import express from "express"
import { deleteAppointment, getAllAppointments,getAllUserAppointments,getDoctorAppointments,postAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";
import { isAdminAuthenticated, isDoctorAuthenticated, isPatientAuthenticated } from "../middleware/auth.js";
const router=express.Router();

router.post("/post",isPatientAuthenticated,postAppointment)
router.get("/getall",isAdminAuthenticated,getAllAppointments)
router.get("/user/getall",isPatientAuthenticated,getAllUserAppointments)
router.get("/doctor/getall",isDoctorAuthenticated,getDoctorAppointments)
router.put("/update/:id",isAdminAuthenticated,updateAppointmentStatus)
router.delete("/delete/:id",isAdminAuthenticated,deleteAppointment)

export default router;