import express from "express"
import { addNewAdmin,addNewDoctor,getAllDoctors,getAllUsers,deleteUsers, getuserDetails, login, logoutAdmin, logoutDoctor, logoutPatient, patientRegister, verifyMail } from "../controller/userController.js"
import {isAdminAuthenticated,isDoctorAuthenticated,isPatientAuthenticated} from "../middleware/auth.js"
const router=express.Router()

router.post("/patient/register",patientRegister)
router.post("/login",login)
router.post("/admin/addAdmin",isAdminAuthenticated,addNewAdmin);
router.get("/doctors",getAllDoctors)
router.get("/users",getAllUsers)
router.get("/admin/me",isAdminAuthenticated,getuserDetails)
router.get("/patient/me",isPatientAuthenticated,getuserDetails)
router.get("/doctor/me",isDoctorAuthenticated,getuserDetails)
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin)
router.get("/patient/logout",isPatientAuthenticated,logoutPatient)
router.get("/doctor/logout",isDoctorAuthenticated,logoutDoctor)
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor)
router.delete("/delete/:id",isAdminAuthenticated,deleteUsers)
router.get('/verify',verifyMail)

export default router