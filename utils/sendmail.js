import { config } from "dotenv";
config({ path: "./config/config.env" });
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");


const smtp_email = process.env.SMTP_EMAIL
const smtp_password = process.env.SMTP_PASSWORD


export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: smtp_email,
        pass: smtp_password,
    },
});

