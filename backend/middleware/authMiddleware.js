import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware bắt buộc phải có token
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không có token xác thực" });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy user từ DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    req.user = user; // gắn user vào request
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// Middleware không bắt buộc phải có token
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch {
    next(); // không có token thì vẫn cho qua
  }
};
