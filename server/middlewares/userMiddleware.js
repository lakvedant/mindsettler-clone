import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  // First, try to get token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback: Check Authorization header (for Safari and other browsers with strict cookie policies)
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


export const isVerified = (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(403).json({ message: "User is not verified" });
  }
};

export const isProfileComplete = (req, res, next) => {
  if (req.user && req.user.profileIsComplete) {
    next();
  } else {
    res.status(403).json({ message: "User profile is not complete" });
  }
};