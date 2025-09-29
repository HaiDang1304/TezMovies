import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import connectDB from "./database.js";
import User from "./models/User.js";
import commentRouter from "./routers/commentRouters.js";
import replyRouter from "./routers/replyRouter.js";
import authRouter from "./routers/authRouter.js";
// Import transporter từ config
import transporter from "./config/emailConfig.js";
import { uploadAvatar } from "./utils/uploadAvatar.js";

// --- Load đúng file env ---
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });
console.log(`🔧 Loading environment from: ${envFile}`);

const app = express();

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// --- Frontend URL ---
const FRONTEND_URL = isProduction
  ? process.env.FRONTEND_URL
  : "http://localhost:5173";

// --- Callback URL cho Google OAuth ---
// Debug môi trường và callback URL
console.log("🔹 NODE_ENV:", process.env.NODE_ENV);
console.log("🔹 isProduction:", process.env.NODE_ENV === "production");
console.log("🔹 FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("🔹 GOOGLE_APP_CALLBACK_DEV:", process.env.GOOGLE_APP_CALLBACK_DEV);
console.log(
  "🔹 GOOGLE_APP_CALLBACK_PROD:",
  process.env.GOOGLE_APP_CALLBACK_PROD
);

// Kiểm tra getCallbackURL
const getCallbackURL = () =>
  process.env.NODE_ENV === "production"
    ? process.env.GOOGLE_APP_CALLBACK_PROD
    : process.env.GOOGLE_APP_CALLBACK_DEV;

console.log("🔹 Callback URL used for Google OAuth:", getCallbackURL());

// Serve static folder /avatars
app.use("/avatars", express.static("public/avatars"));

// --- Middleware ---
app.use(express.json());
app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// --- Session ---
if (!process.env.SESSION_SECRET) {
  throw new Error(" SESSION_SECRET chưa được cấu hình trong .env");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    rolling: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    },
  })
);

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- Google Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: getCallbackURL(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Upload avatar Google lên Cloudinary
          const avatarUrl = await uploadAvatar(
            profile.photos[0].value,
            profile.id
          );

          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: avatarUrl, // Lưu URL Cloudinary thay vì Google URL
          });
          console.log("✅ User created:", user.email);
        } else {
          console.log("ℹ️ User already exists:", user.email);
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Deserialize error:", err);
    done(err, null);
  }
});

function isAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).json({ msg: "Bạn cần đăng nhập để bình luận" });
}

// --- Auth routes ---
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: FRONTEND_URL }),
  (req, res) => {
    console.log(
      `✅ Authentication successful in ${
        isProduction ? "production" : "development"
      }`
    );
    res.redirect(`${FRONTEND_URL}?auth=success`);
  }
);

// --- User info ---
app.get("/api/user", (req, res) => {
  console.log("🔍 /api/user called | Session:", req.sessionID);
  console.log("🔍 Session data:", req.session);

  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else if (req.user) {
    // Fallback cho Google OAuth
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Unauthorized", sessionID: req.sessionID });
  }
});

// --- Logout ---
app.post("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy((err) => {
      if (err)
        return res.status(500).json({ message: "Session destroy failed" });
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// --- Test route ---
app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
    environment: isProduction ? "production" : "development",
    callbackURL: getCallbackURL(),
    sessionID: req.sessionID,
    hasUser: !!req.user,
  });
});

// --- Routers ---
app.use("/api/comments", commentRouter);
app.use("/api/replies", replyRouter);
app.use("/api/auth", authRouter);

// --- Connect DB + Start Server ---
connectDB();
app.listen(PORT, () =>
  console.log(
    `🚀 Server running on port ${PORT} (${
      isProduction ? "production" : "development"
    })`
  )
);

export { isAuthenticated, transporter };
