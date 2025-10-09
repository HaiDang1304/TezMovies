import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import connectDB from "./database.js";
import User from "./models/User.js";
import commentRouter from "./routers/commentRouters.js";
import replyRouter from "./routers/replyRouter.js";
import authRouter from "./routers/authRouter.js";
import getUserRoutes from "./routers/getUser.js";
import { uploadAvatar } from "./utils/uploadAvatar.js";
import { isAuthenticated } from "./middleware/auth.js";

// --- Load ENV ---
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });
console.log(`🔧 Loading environment from: ${envFile}`);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const FRONTEND_URL = isProduction ? process.env.FRONTEND_URL : "http://localhost:5173";

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true, // cho phép gửi cookie
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Passport Google OAuth ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: isProduction
        ? process.env.GOOGLE_APP_CALLBACK_PROD
        : process.env.GOOGLE_APP_CALLBACK_DEV,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const avatarUrl = await uploadAvatar(profile.photos[0].value, profile.id);
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            gender: "other",
            picture: avatarUrl,
            isVerified: true,
          });
          console.log("✅ User created:", user.email);
        }

        // Tạo JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --- Auth routes ---
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: FRONTEND_URL, session:false }),
  (req, res) => {
    const { token } = req.user;

    // Set JWT vào cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.redirect(`${FRONTEND_URL}/`);
  }
);

// --- Middleware verifyToken ---
function verifyToken(req, res, next) {
  const token =
    req.cookies?.token || (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// --- API protected ---
app.get("/api/user", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

// --- Logout ---
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
});

// --- Test route ---
app.get("/", (req, res) => {
  res.json({
    message: "Server is running with JWT in cookies",
    environment: isProduction ? "production" : "development",
  });
});

// --- Routers ---
app.use("/api/comments", commentRouter);
app.use("/api/replies", replyRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", getUserRoutes);

// --- Start server ---
connectDB();
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} (${isProduction ? "production" : "development"})`)
);

export { verifyToken };
