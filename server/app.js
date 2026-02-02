import dotenv from "dotenv";
dotenv.config();
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
import walletTransactionsRoute from './routes/walletRoute.js'
import chatRoutes from "./routes/chat.routes.js";
import { protect } from "./middlewares/userMiddleware.js";
import connectDB from "./config/db.js";
import { globalLimiter } from './middlewares/rateLimiter.js';

await connectDB();
const app = express();
app.set("trust proxy", 1);

app.use(cookieParser());
app.use(globalLimiter);

const isProduction = process.env.NODE_ENV === "production";
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["set-cookie"],
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "mindsettler_secret_key", 
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

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/user", userRoute);
app.use("/api/appointment", appointnentRoute);
app.use("/api/admin", adminRoute);
app.use('/api/transactions', protect, walletTransactionsRoute);
app.use("/api/chat", chatRoutes);

export default app;