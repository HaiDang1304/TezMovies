// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import path from "path";
// import express from "express";
// import cors from "cors";
// import connectDB from "./database.js";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "./models/User.js";
// import session from "express-session";

// // Load đúng file .env theo môi trường
// const envFile =
//   process.env.NODE_ENV === "production" ? ".env.production" : ".env";
// dotenv.config({ path: envFile });
// console.log(`🔧 Loading environment from: ${envFile}`);

// const app = express();

// // Biến môi trường
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// const PORT = process.env.PORT || 3000;
// const isProduction = process.env.NODE_ENV === "production";

// // Helper: Callback URL cho Google OAuth
// function getCallbackURL() {
//   return isProduction
//     ? process.env.GOOGLE_APP_CALLBACK_PROD
//     : process.env.GOOGLE_APP_CALLBACK_DEV;
// }

// // CORS setup
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       process.env.FRONTEND_URL || "http://localhost:5173",
//       "https://tez-movies.vercel.app",
//       "http://localhost:5173", // Luôn cho phép local dev
//     ];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
// app.use(cors(corsOptions));
// app.use(express.json());

// if (isProduction) {
//   app.set("trust proxy", 1); // Render/Heroku cần trust proxy
// }

// // Session config
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     proxy: isProduction,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000, // 24h
//       httpOnly: true,
//       // secure: isProduction,
//       // sameSite: isProduction ? "none" : "lax",
//       secure: true, // BẮT BUỘC khi SameSite=None
//       sameSite: "none", // Để cross-domain cookie hoạt động
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // Passport Google setup
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: getCallbackURL(),
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           user = await User.create({
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             name: profile.displayName,
//             picture: profile.photos[0].value,
//           });
//           console.log("✅ User created:", user.email);
//         } else {
//           console.log("ℹ️ User already exists:", user.email);
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // Google auth routes
// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account", // luôn hiển thị chọn tài khoản
//   })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     console.log(
//       `✅ Authentication successful in ${
//         isProduction ? "production" : "development"
//       }`
//     );
//     res.redirect(`${FRONTEND_URL}?auth=success`);
//   }
// );

// // User info route
// app.get("/api/user", (req, res) => {
//   console.log("🔍 /api/user called");
//   console.log("🔍 Session ID:", req.sessionID);
//   console.log("🔍 User:", req.user);

//   if (req.user) {
//     res.json({ user: req.user });
//   } else {
//     res.status(401).json({
//       message: "Unauthorized",
//       debug: {
//         sessionID: req.sessionID,
//         hasSession: !!req.session,
//         environment: process.env.NODE_ENV,
//       },
//     });
//   }
// });

// // Logout route
// app.post("/auth/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).json({ message: "Logout failed" });
//     req.session.destroy((err) => {
//       if (err)
//         return res.status(500).json({ message: "Session destroy failed" });
//       res.clearCookie("connect.sid");
//       res.status(200).json({ message: "Logged out successfully" });
//     });
//   });
// });

// // Test route
// app.get("/", (req, res) => {
//   const isMobile =
//     /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
//       req.get("User-Agent")
//     );

//   res.json({
//     message: "Server is running!",
//     environment: isProduction ? "production" : "development",
//     callbackURL: getCallbackURL(),
//     hasGoogleCredentials: !!(
//       process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
//     ),
//     userAgent: req.get("User-Agent"),
//     isMobile: isMobile,
//     sessionID: req.sessionID,
//     hasUser: !!req.user,
//   });
// });

// // Kết nối DB
// connectDB();

// // Start server
// app.listen(PORT, () => {
//   console.log(
//     `🚀 Server running on port ${PORT} (${
//       isProduction ? "production" : "development"
//     })`
//   );
// });
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import connectDB from "./database.js";
import User from "./models/User.js";

// Load env đúng môi trường
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });
console.log(`🔧 Loading environment from: ${envFile}`);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const FRONTEND_URL = isProduction
  ? "https://tez-movies.vercel.app"
  : "http://localhost:5173";

// --- Helper callback URL cho Google OAuth ---
const getCallbackURL = () =>
  isProduction
    ? process.env.GOOGLE_APP_CALLBACK_PROD
    : process.env.GOOGLE_APP_CALLBACK_DEV;

// --- Middleware ---
app.use(express.json());
app.set("trust proxy", 1); 

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // bắt buộc gửi cookie
  })
);

// --- Session với MongoStore ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- Passport Google ---
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
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0].value,
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
    done(err, null);
  }
});

// --- Auth routes ---
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: FRONTEND_URL }),
  (req, res) => {
    console.log(`✅ Authentication successful in ${isProduction ? "production" : "development"}`);
    res.redirect(`${FRONTEND_URL}?auth=success`);
  }
);

// --- User info ---
app.get("/api/user", (req, res) => {
  console.log("🔍 /api/user called | Session:", req.sessionID);
  if (req.user) {
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
      if (err) return res.status(500).json({ message: "Session destroy failed" });
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

// --- Connect DB + Start Server ---
connectDB();
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} (${isProduction ? "production" : "development"})`)
);
// import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import connectDB from "./database.js";
// import User from "./models/User.js";

// // Load env đúng môi trường
// const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
// dotenv.config({ path: envFile });
// console.log(`🔧 Loading environment from: ${envFile}`);

// const app = express();
// const PORT = process.env.PORT || 3000;
// const isProduction = process.env.NODE_ENV === "production";
// const FRONTEND_URL = isProduction
//   ? "https://tez-movies.vercel.app"
//   : "http://localhost:5173";

// // --- Helper callback URL cho Google OAuth ---
// const getCallbackURL = () =>
//   isProduction
//     ? process.env.GOOGLE_APP_CALLBACK_PROD
//     : process.env.GOOGLE_APP_CALLBACK_DEV;

// // --- Middleware ---
// app.use(express.json());
// app.set("trust proxy", 1); 

// // CORS configuration với cải thiện cho mobile
// app.use(
//   cors({
//     origin: [FRONTEND_URL, "https://tez-movies.vercel.app"], // Thêm explicit domain
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
//     optionsSuccessStatus: 200 // for legacy browser support
//   })
// );

// // --- Session với MongoStore - Cải thiện cho mobile ---
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//       ttl: 24 * 60 * 60, // 24 hours
//       touchAfter: 24 * 3600 // lazy session update
//     }),
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//       httpOnly: true,
//       secure: isProduction, // chỉ HTTPS khi production
//       sameSite: isProduction ? "none" : "lax", // cho phép cross-site cookies
//       domain: isProduction ? undefined : undefined, // không set domain cụ thể
//       path: "/"
//     },
//     name: "connect.sid", // explicit session name
//     rolling: true // reset expiration on each request
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // --- Passport Google ---
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: getCallbackURL(),
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           user = await User.create({
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             name: profile.displayName,
//             picture: profile.photos[0].value,
//           });
//           console.log("✅ User created:", user.email);
//         } else {
//           console.log("ℹ️ User already exists:", user.email);
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => done(null, user._id));
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // --- Auth routes ---
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { 
//     scope: ["profile", "email"], 
//     prompt: "select_account",
//     accessType: 'offline' // để có refresh token
//   })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}?auth=failed` }),
//   async (req, res) => {
//     console.log(`✅ Authentication successful in ${isProduction ? "production" : "development"}`);
//     console.log(`👤 User ID: ${req.user._id}`);
//     console.log(`🍪 Session ID: ${req.sessionID}`);
    
//     // Force save session trước khi redirect (quan trọng cho mobile)
//     req.session.save((err) => {
//       if (err) {
//         console.error('❌ Session save error:', err);
//         return res.redirect(`${FRONTEND_URL}?auth=failed`);
//       }
//       console.log('✅ Session saved successfully');
      
//       // Redirect với delay nhỏ cho mobile
//       setTimeout(() => {
//         res.redirect(`${FRONTEND_URL}?auth=success&t=${Date.now()}`);
//       }, 100);
//     });
//   }
// );

// // --- User info with enhanced logging ---
// app.get("/api/user", (req, res) => {
//   console.log("🔍 /api/user called");
//   console.log(`📱 User Agent: ${req.get('User-Agent')}`);
//   console.log(`🍪 Session ID: ${req.sessionID}`);
//   console.log(`👤 Has User: ${!!req.user}`);
//   console.log(`🔒 Session Data:`, Object.keys(req.session));
  
//   if (req.user) {
//     console.log(`✅ User found: ${req.user.email}`);
//     res.json({ 
//       user: req.user,
//       sessionId: req.sessionID,
//       authenticated: true
//     });
//   } else {
//     console.log(`❌ No user in session`);
//     res.status(401).json({ 
//       message: "Unauthorized", 
//       sessionID: req.sessionID,
//       authenticated: false
//     });
//   }
// });

// // --- Health check route ---
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "ok",
//     environment: isProduction ? "production" : "development",
//     hasSession: !!req.sessionID,
//     hasUser: !!req.user,
//     timestamp: new Date().toISOString()
//   });
// });

// // --- Logout ---
// app.post("/auth/logout", (req, res) => {
//   console.log(`🔄 Logout attempt for session: ${req.sessionID}`);
  
//   req.logout((err) => {
//     if (err) {
//       console.error('❌ Logout error:', err);
//       return res.status(500).json({ message: "Logout failed" });
//     }
    
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('❌ Session destroy error:', err);
//         return res.status(500).json({ message: "Session destroy failed" });
//       }
      
//       res.clearCookie("connect.sid", {
//         httpOnly: true,
//         secure: isProduction,
//         sameSite: isProduction ? "none" : "lax",
//         path: "/"
//       });
      
//       console.log('✅ Logged out successfully');
//       res.status(200).json({ message: "Logged out successfully" });
//     });
//   });
// });

// // --- Test route ---
// app.get("/", (req, res) => {
//   res.json({
//     message: "Server is running",
//     environment: isProduction ? "production" : "development",
//     callbackURL: getCallbackURL(),
//     sessionID: req.sessionID,
//     hasUser: !!req.user,
//     userAgent: req.get('User-Agent'),
//     isMobile: /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(req.get('User-Agent'))
//   });
// });

// // --- Connect DB + Start Server ---
// connectDB();
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT} (${isProduction ? "production" : "development"})`)
// );