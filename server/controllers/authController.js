import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";

// Forgot Password - Send Reset Link
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id, purpose: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Configure Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    // Email Template
    const mailOptions = {
      from: `"MindSettler Support" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Reset Your Password - MindSettler",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3F2965, #DD1764); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3F2965, #DD1764); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 13px; border-left: 4px solid #ffc107; }
            .link-box { background: #eee; padding: 12px; border-radius: 5px; word-break: break-all; font-size: 12px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name}!</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link in your browser:</p>
              <div class="link-box">${resetLink}</div>
              
              <div class="warning">
                ⚠️ <strong>Important:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
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
      message: "If an account exists with this email, you will receive a password reset link.",
    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process request. Please try again later.",
    });
  }
};

// Reset Password - Verify Token & Update Password
export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    // Validate inputs
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Reset link has expired. Please request a new one.",
          expired: true,
        });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(400).json({
          success: false,
          message: "Invalid reset link.",
        });
      }
      throw jwtError;
    }

    // Check token purpose
    if (decoded.purpose !== "password_reset") {
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

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Send confirmation email
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
      subject: "Password Changed Successfully - MindSettler",
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
            .success-box { background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Password Changed</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name}!</h2>
              
              <div class="success-box">
                <strong>Your password has been successfully changed.</strong>
              </div>
              
              <p>You can now log in with your new password.</p>
              
              <p style="color: #666; font-size: 13px; margin-top: 20px;">
                If you didn't make this change, please contact our support team immediately.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} MindSettler. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again later.",
    });
  }
};

// Verify Reset Token (Optional - for checking token validity before showing form)
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Token is required",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          valid: false,
          message: "Reset link has expired",
          expired: true,
        });
      }
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid reset link",
      });
    }

    // Check token purpose
    if (decoded.purpose !== "password_reset") {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid token",
      });
    }

    // Check if user exists
    const user = await User.findById(decoded.id).select("email name");

    if (!user) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      message: "Token is valid",
      email: user.email,
    });

  } catch (error) {
    console.error("❌ Verify Token Error:", error);
    res.status(500).json({
      success: false,
      valid: false,
      message: "Failed to verify token",
    });
  }
};