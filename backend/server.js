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

// dotenv.config();

// const app = express();

// // Load biến môi trường
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// const PORT = process.env.PORT || 3000;

// // CORS setup
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       process.env.FRONTEND_URL || "http://localhost:5173",
//       "https://tez-movies.vercel.app",
//     ];
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   // origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// app.use(express.json());

// // Session config
// // app.use(
// //   session({
// //     secret: process.env.SESSION_SECRET || "your-secret-key",
// //     resave: false,
// //     saveUninitialized: false,
// //     cookie: {
// //       secure: process.env.NODE_ENV === "production",
// //       httpOnly: true,
// //       sameSite: "none",
// //     },
// //   })
// // );

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     proxy: true,
//     saveUninitialized: false,
//     expiration: 360,
//     cookie: {
//       maxAge: 300 * 1000,
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
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
//       callbackURL: process.env.GOOGLE_APP_CALLBACK,
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
//           console.log("✅ User created:", user);
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
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect(FRONTEND_URL);
//   }
// );

// // User info route
// app.get("/api/user", (req, res) => {
//   if (req.user) {
//     res.json({ user: req.user });
//   } else {
//     res.status(401).json({ message: "Unauthorized" });
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
//   res.json({ message: "Server is running!" });
// });

// // Connect DB
// connectDB();

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
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

// // Load biến môi trường
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// const PORT = process.env.PORT || 3000;
// const isProduction = process.env.NODE_ENV === "production";

// // CORS setup
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       process.env.FRONTEND_URL || "http://localhost:5173",
//       "https://tez-movies.vercel.app",
//       "http://localhost:5173", // Always allow localhost for development
//     ];
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
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

// // Session config - Điều kiện theo môi trường
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     proxy: isProduction, // Chỉ true khi production
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//       httpOnly: true,
//       secure: isProduction, // true khi production (HTTPS), false khi development (HTTP)
//       sameSite: isProduction ? "none" : "lax", // "none" cho production, "lax" cho development
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // Passport Google setup - Callback URL theo môi trường
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: isProduction
//         ? process.env.GOOGLE_APP_CALLBACK_PROD
//         : process.env.GOOGLE_APP_CALLBACK_DEV,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log(
//         "GOOGLE CALLBACK URL ->",
//         isProduction
//           ? process.env.GOOGLE_APP_CALLBACK_PROD
//           : process.env.GOOGLE_APP_CALLBACK_DEV
//       );

//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           user = await User.create({
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             name: profile.displayName,
//             picture: profile.photos[0].value,
//           });
//           console.log("✅ User created:", user);
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
//     prompt: "select_account", // Luôn hiển thị màn hình chọn tài khoản
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
//     res.redirect(FRONTEND_URL);
//   }
// );

// // User info route
// app.get("/api/user", (req, res) => {
//   if (req.user) {
//     res.json({ user: req.user });
//   } else {
//     res.status(401).json({ message: "Unauthorized" });
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
//   res.json({
//     message: "Server is running!",
//     environment: isProduction ? "production" : "development",
//   });
// });

// // Connect DB
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
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import cors from "cors";
import connectDB from "./database.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/User.js";
import session from "express-session";

// Load đúng file .env theo môi trường
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });
console.log(`🔧 Loading environment from: ${envFile}`);

const app = express();

// Biến môi trường
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Helper: Callback URL cho Google OAuth
function getCallbackURL() {
  return isProduction
    ? process.env.GOOGLE_APP_CALLBACK_PROD
    : process.env.GOOGLE_APP_CALLBACK_DEV;
}

// CORS setup
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://tez-movies.vercel.app",
      "http://localhost:5173", // Luôn cho phép local dev
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

if (isProduction) {
  app.set("trust proxy", 1); // Render/Heroku cần trust proxy
}

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24h
      httpOnly: true,
      // secure: isProduction,
      // sameSite: isProduction ? "none" : "lax",
      secure: true, // BẮT BUỘC khi SameSite=None
      sameSite: "none", // Để cross-domain cookie hoạt động
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Google setup
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

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google auth routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // luôn hiển thị chọn tài khoản
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log(
      `✅ Authentication successful in ${
        isProduction ? "production" : "development"
      }`
    );
    res.redirect(`${FRONTEND_URL}?auth=success`);
  }
);

// User info route
app.get("/api/user", (req, res) => {
  console.log("🔍 /api/user called");
  console.log("🔍 Session ID:", req.sessionID);
  console.log("🔍 User:", req.user);

  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({
      message: "Unauthorized",
      debug: {
        sessionID: req.sessionID,
        hasSession: !!req.session,
        environment: process.env.NODE_ENV,
      },
    });
  }
});

// Logout route
app.post("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy((err) => {
      if (err)
        return res.status(500).json({ message: "Session destroy failed" });
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// Test route
app.get("/", (req, res) => {
  const isMobile =
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
      req.get("User-Agent")
    );

  res.json({
    message: "Server is running!",
    environment: isProduction ? "production" : "development",
    callbackURL: getCallbackURL(),
    hasGoogleCredentials: !!(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ),
    userAgent: req.get("User-Agent"),
    isMobile: isMobile,
    sessionID: req.sessionID,
    hasUser: !!req.user,
  });
});

// Kết nối DB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} (${
      isProduction ? "production" : "development"
    })`
  );
});
