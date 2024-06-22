import express from "express";
import {isAdminAuthenticated,isPatientAuthenticated} from "../middleware/auth.js"
import { getAllMessages, sendMessage } from "../controller/messageController.js";

const router =express.Router();
router.post("/send",sendMessage);
router.get("/getall",isAdminAuthenticated,getAllMessages);

export default router;