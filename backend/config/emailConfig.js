import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Lấy biến môi trường, fallback để debug local
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.EMAIL_USER;
const SMTP_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true cho 465, false cho 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verification Error:", error);
    console.log("🔹 SMTP_HOST:", SMTP_HOST);
    console.log("🔹 SMTP_PORT:", SMTP_PORT);
  } else {
    console.log("✅ SMTP Server is ready");
    console.log("📧 Email User:", SMTP_USER);
  }
});

export default transporter;
