import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session"; // 1. Import session
import MongoStore from "connect-mongo"; // 2. Import Mongo storage

// Routes
import userRoute from "./routes/userRoute.js";
import appointnentRoute from "./routes/appointmentRoute.js";
import adminRoute from "./routes/adminRoute.js";
import walletTransactionsRoute from './routes/walletRoute.js'
import chatRoutes from "./routes/chat.routes.js";
import { protect } from "./middlewares/userMiddleware.js";
import connectDB from "./config/db.js";
import { globalLimiter } from './middlewares/rateLimiter.js';

// Connect to Database
await connectDB();
const app = express();
app.set("trust proxy", 1); // Trust first proxy (needed for secure cookies behind proxies)

// Cookie parser must be before session
app.use(cookieParser());

app.use(globalLimiter);

// Middlewares - CORS must be early
const isProduction = process.env.NODE_ENV === "production";
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Crucial: Allows frontend to send session cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["set-cookie"],
}));

// --- SESSION CONFIGURATION (Must be before routes) ---
// This enables req.session for your chatbot
app.use(session({
  secret: process.env.SESSION_SECRET || "mindsettler_secret_key", 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Uses your MongoDB to save chat state
    collectionName: "sessions",
  }),
  cookie: {
    secure: isProduction, // Must be true in production for Safari (requires HTTPS)
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax", // "none" required for cross-site cookies in Safari
    maxAge: 24 * 60 * 60 * 1000, // Session expires in 24 hours
  }
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Route Registrations
app.use("/api/user", userRoute);
app.use("/api/appointment", appointnentRoute);
app.use("/api/admin", adminRoute);
app.use('/api/transactions', protect, walletTransactionsRoute);
app.use("/api/chat", chatRoutes); // Chat route now has access to req.session

export default app;