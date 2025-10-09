import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import session from "express-session";
import transporter from "../config/emailConfig.js";

const router = express.Router();

// --- Middleware session (nếu chưa setup ở server.js) ---
router.use(
  session({
    secret: process.env.SESSION_SECRET || "some_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // secure:true nếu dùng HTTPS
  })
);

// ------------------- REGISTER -------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email đã tồn tại" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      picture: `${process.env.FRONTEND_URL}/avatar/avatar-default-register.jpg`,
      verificationToken,
      isVerified: false,
    });

    // URL xác thực
    const verifyURL = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    // Gửi email xác thực
    await transporter.sendMail({
      from: `"Tez Movies" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Xác nhận tài khoản - Tez Movies",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2>Xin chào ${name}!</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Tez Movies</strong>.</p>
          <p>Nhấn nút bên dưới để xác nhận tài khoản:</p>
          <div style="text-align:center; margin:20px 0;">
            <a href="${verifyURL}" 
               style="background:#007bff; color:white; padding:12px 30px; text-decoration:none; border-radius:5px;">
               Xác nhận tài khoản
            </a>
          </div>
          <p>Hoặc copy link này vào trình duyệt: <a href="${verifyURL}">${verifyURL}</a></p>
        </div>
      `,
    });

    res.json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.",
      email,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Lỗi server khi đăng ký", error: err.message });
  }
});

// ------------------- VERIFY EMAIL -------------------
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ message: "Token xác thực không hợp lệ" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
      message: "Xác nhận email thành công! Bạn có thể đăng nhập.",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Verify error:", err);
    res.status(500).json({ message: "Lỗi server khi xác thực email" });
  }
});

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔑 Login attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email chưa được đăng ký" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Email chưa được xác thực" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng" });

    // --- Tạo session ---
    req.session.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    };

    console.log("👤 User logged in - Session:", req.session.user);

    res.json({
      message: "Đăng nhập thành công",
      user: req.session.user,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
});

// ------------------- LOGOUT -------------------
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Không thể đăng xuất" });
    res.clearCookie("connect.sid");
    res.json({ message: "Đăng xuất thành công" });
  });
});

// ------------------- TEST ROUTE -------------------
router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes working!",
    timestamp: new Date().toISOString(),
    routes: ["POST /register", "GET /verify/:token", "POST /login", "POST /logout"],
  });
});

export default router;
