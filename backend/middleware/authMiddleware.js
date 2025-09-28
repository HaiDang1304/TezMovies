// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ cookie hoặc header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Không có token xác thực" });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Lấy thông tin user từ database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    // Lưu user vào req để sử dụng trong các route khác
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// Middleware kiểm tra user đã đăng nhập (optional)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Không có token hoặc token không hợp lệ - vẫn cho phép truy cập
    next();
  }
};