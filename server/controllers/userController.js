import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// Contact email imports
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper function to create JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user._id);
    const cookieOptions = {
      httpOnly: true, // Prevents XSS attacks from reading the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };
    const userResponse = user.toObject();
    delete userResponse.password; // Remove password from response
    res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Find user & include password (since we set select: false in schema)
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken(user._id);
    const cookieOptions = {
      httpOnly: true, // Prevents XSS attacks from reading the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };
    const userResponse = user.toObject();
    delete userResponse.password; // Remove password from response
    res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user (for frontend auth)
// @route   GET /api/user/me
// @access  Private
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
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

    // 1. Read the HTML template file
    // Adjust the path below to point exactly to your template file
    const templatePath = path.join(__dirname, "../templates/contactEmail.html");
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    // 2. Replace placeholders with actual data
    htmlContent = htmlContent
      .replace(/{{name}}/g, name)
      .replace(/{{email}}/g, email)
      .replace(/{{subject}}/g, subject || "General Inquiry")
      .replace(/{{message}}/g, message)
      .replace(/{{timestamp}}/g, new Date().toLocaleString());
    // 3. Configure Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD, // Use Gmail App Password
      },
    });

    // 4. Define Mail Options
    const mailOptions = {
      from: `"MindSettler Contact" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email, // Direct reply to user
      subject: `New Message: ${subject}`,
      html: htmlContent,
    };

    // 5. Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("❌ Email Error:", error);
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
    }).select("-password"); // Exclude password from response

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
    const { companyName, contactPerson, workEmail, subject, message } =
      req.body;

    // 1. Read the HTML template file
    const templatePath = path.join(
      __dirname,
      "../templates/corporateEmail.html",
    );
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    // 2. Replace placeholders with actual data
    htmlContent = htmlContent
      .replace(/{{companyName}}/g, companyName)
      .replace(/{{contactPerson}}/g, contactPerson)
      .replace(/{{workEmail}}/g, workEmail)
      .replace(/{{subject}}/g, subject || "Corporate Inquiry")
      .replace(/{{message}}/g, message)
      .replace(/{{timestamp}}/g, new Date().toLocaleString());

    // 3. Configure Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD, // Use Gmail App Password
      },
    });

    // 4. Define Mail Options
    const mailOptions = {
      from: `"MindSettler Corporate" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: workEmail, // Direct reply to user
      subject: `New Corporate Message: ${subject || "Corporate Inquiry"}`,
      html: htmlContent,
    };

    // 5. Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Could not send email." });
  }
};

// Send Verification Link
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

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: userId, purpose: "email_verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Configure Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    // Define Mail Options
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

    // Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification email has been sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not send email.",
    });
  }
};

// Verify Email Token
export const verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Verification link has expired. Please request a new one.",
          expired: true,
        });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(400).json({
          success: false,
          message: "Invalid verification link.",
        });
      }
      throw jwtError;
    }

    // Check token purpose
    if (decoded.purpose !== "email_verification") {
      return res.status(400).json({
        success: false,
        message: "Invalid token purpose",
      });
    }

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
        alreadyVerified: true,
      });
    }

    // Update user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now access all features.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("❌ Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not verify email.",
    });
  }
};
