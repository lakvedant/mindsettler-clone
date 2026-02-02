import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user._id);
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    };
    const userResponse = user.toObject();
    delete userResponse.password;
    res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken(user._id);
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    };
    const userResponse = user.toObject();
    delete userResponse.password;
    res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      user: userResponse,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const templatePath = path.join(__dirname, "../templates/contactEmail.html");
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    htmlContent = htmlContent
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{subject}}/g, subject || "General Inquiry")
      .replace(/{{message}}/g, message)
      .replace(/{{timestamp}}/g, new Date().toLocaleString());

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"MindSettler Contact" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New Message: ${subject}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Email Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Could not send email." });
  }
};

export const profileUpdate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, gender } = req.body;
    const updates = { name, phone, gender, profileIsComplete: true };

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const sendCorporateEmail = async (req, res) => {
  try {
    const { companyName, contactPerson, workEmail, subject, message } = req.body;

    const templatePath = path.join(__dirname, "../templates/corporateEmail.html");
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    htmlContent = htmlContent
      .replace(/{{companyName}}/g, companyName)
      .replace(/{{contactPerson}}/g, contactPerson)
      .replace(/{{workEmail}}/g, workEmail)
      .replace(/{{subject}}/g, subject || "Corporate Inquiry")
      .replace(/{{message}}/g, message)
      .replace(/{{timestamp}}/g, new Date().toLocaleString());

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"MindSettler Corporate" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: workEmail,
      subject: `New Corporate Message: ${subject || "Corporate Inquiry"}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Email Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Could not send email." });
  }
};


export const sendVerificationLink = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = jwt.sign(
      { id: userId, purpose: "email_verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"MindSettler Support" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Verify Your Email - MindSettler",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3F2965, #DD1764); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3F2965, #DD1764); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; padding: 10px; border-radius: 5px; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧠 MindSettler</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name}! 👋</h2>
              <p>Thank you for joining MindSettler. Please verify your email address to complete your registration and access all features.</p>
              
              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">✅ Verify My Email</a>
              </div>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-size: 12px;">${verificationLink}</p>
              
              <div class="warning">
                ⏰ <strong>This link will expire in 1 hour.</strong><br>
                If you didn't create an account with MindSettler, please ignore this email.
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} MindSettler. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification email has been sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error: Could not send email." 
    });
  }
};

export const verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "Verification token is required" 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(400).json({ 
          success: false, 
          message: "Verification link has expired. Please request a new one.",
          expired: true
        });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid verification link." 
        });
      }
      throw jwtError;
    }

    if (decoded.purpose !== "email_verification") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid token purpose" 
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (user.isVerified) {
      return res.status(200).json({ 
        success: true, 
        message: "Email is already verified",
        alreadyVerified: true
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now access all features.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error: Could not verify email." 
    });
  }
};
