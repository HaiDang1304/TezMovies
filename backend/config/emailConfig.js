import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Tạo transporter duy nhất
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true cho 465, false cho 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password không có khoảng trắng
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verification Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
    console.log("📧 Email User:", process.env.EMAIL_USER);
  }
});

export default transporter;