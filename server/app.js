import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import userRoute from "./routes/userRoute.js";
import appointnentRoute from "./routes/appointmentRoute.js";
import adminRoute from "./routes/adminRoute.js";
import sessionPaymentRoute from './routes/sessionPaymentRoute.js'
import chatRoutes from "./routes/chat.routes.js";
import faqRoute from "./routes/faqRoute.js";
import therapyRoute from "./routes/therapyRoute.js";
import blogRoute from "./routes/blogRoute.js";
import blogPaymentRoute from "./routes/blogPaymentRoute.js";
import eventRoute from "./routes/eventRoute.js";
import { protect } from "./middlewares/userMiddleware.js";
import connectDB from "./config/db.js";
import { globalLimiter } from './middlewares/rateLimiter.js';

await connectDB();
const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Baseline headers without introducing another runtime dependency. Keep the
// CSP deliberately conservative because the client currently loads third-party
// assets and inline styles.
app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  next();
});

app.use(cookieParser());
app.use(globalLimiter);

const isProduction = process.env.NODE_ENV === "production";
const normalizeOrigin = (value = "") => value.replace(/\/+$/, "");
const allowedOrigin = normalizeOrigin(process.env.FRONTEND_URL || "");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl/postman/server-to-server)
      if (!origin) return callback(null, true);

      const normalizedRequestOrigin = normalizeOrigin(origin);
      if (normalizedRequestOrigin === allowedOrigin) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

app.use(express.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
app.use(morgan(isProduction ? "combined" : "dev"));

// Used by Render and other deployment platforms to determine whether the
// process is alive and able to receive requests.
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/user", userRoute);
app.use("/api/appointment", appointnentRoute);
app.use("/api/admin", adminRoute);
app.use('/api/session-payments', protect, sessionPaymentRoute);
app.use("/api/chat", chatRoutes);
app.use('/api/faq', faqRoute);
app.use('/api/therapy', therapyRoute);
app.use('/api/blog', blogRoute);
app.use('/api/blog-payment', blogPaymentRoute);
app.use("/api/events", eventRoute);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  if (error.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ success: false, message: "Origin is not allowed" });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body is too large" });
  }

  console.error("Unhandled request error:", error);
  return res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;
