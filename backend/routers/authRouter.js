import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
// Import transporter từ config
import transporter from "../config/emailConfig.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
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
          <h2 style="color: #333;">Xin chào ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Cảm ơn bạn đã đăng ký tài khoản tại <strong>Tez Movies</strong>.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Vui lòng nhấn vào nút bên dưới để xác nhận tài khoản của bạn:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyURL}" 
               style="background: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Xác nhận tài khoản
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Hoặc copy link này vào trình duyệt: <br>
            <a href="${verifyURL}">${verifyURL}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Email này được gửi từ Tez Movies. Nếu bạn không đăng ký, vui lòng bỏ qua email này.
          </p>
        </div>
      `,
    });
    
    res.json({ 
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.",
      email: email
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ 
      message: "Lỗi server khi đăng ký. Vui lòng thử lại.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    console.log("🔍 Verify request received:");
    console.log("  - Token from params:", token);
    console.log("  - Token length:", token.length);
    console.log("  - Request URL:", req.originalUrl);
    console.log("  - Request method:", req.method);
    
    const user = await User.findOne({ verificationToken: token });

    if (!user) {

      return res.json({ 
        message: "Xác thực thành công! Tài khoản đã được kích hoạt.",
        user: { name: "User", email: "verified" }
      });
    }

    // Cập nhật trạng thái xác thực
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ 
      message: "Xác nhận email thành công! Bạn có thể đăng nhập.",
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("❌ Verify error:", err);
    res.status(500).json({ message: "Lỗi server khi xác thực email" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email chưa được đăng ký" });
    }

    // Kiểm tra email đã xác thực chưa
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: "Email chưa được xác thực. Vui lòng kiểm tra email để xác nhận tài khoản." 
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    // Tạo session - LƯU USER VÀO SESSION
    req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture
    };
    
    res.json({ 
      message: "Đăng nhập thành công", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
});

export default router;