import express from "express";
import { body } from "express-validator";
import {
  userSignup,
  login,
  getMe,
  logout,
  sendContactEmail,
  profileUpdate,
  sendCorporateEmail,
  sendVerificationLink,
  verifyEmailToken,
} from "../controllers/userController.js";
import { isVerified, protect } from "../middlewares/userMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/signup",
  authLimiter,
  [
    body("name")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters long"),
  ],
  validate,
  userSignup
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  validate,
  login
);

router.post("/logout", protect, logout);

router.get("/me", protect, getMe);
router.patch(
  "/profile",
  authLimiter,
  protect,
  isVerified,
  [
    body("name")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters"),
    body("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Gender must be Male, Female, or Other"),
    body("phone")
      .matches(/^\d{10}$/)
      .withMessage("Phone must be a 10 digit number"),
  ],
  validate,
  profileUpdate
);

router.post(
  "/contact/send",
  authLimiter,
  [
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
    body("subject").optional().trim().isLength({ max: 150 }).withMessage("Subject must be at most 150 characters"),
    body("message").trim().isLength({ min: 1, max: 5000 }).withMessage("Message must be between 1 and 5000 characters"),
  ],
  validate,
  sendContactEmail
);
router.post(
  "/corporate/send",
  authLimiter,
  [
    body("companyName").trim().isLength({ min: 2, max: 150 }).withMessage("Company name must be between 2 and 150 characters"),
    body("contactPerson").trim().isLength({ min: 2, max: 100 }).withMessage("Contact name must be between 2 and 100 characters"),
    body("workEmail").isEmail().normalizeEmail().withMessage("Please provide a valid work email address"),
    body("subject").optional().trim().isLength({ max: 150 }).withMessage("Subject must be at most 150 characters"),
    body("message").trim().isLength({ min: 1, max: 5000 }).withMessage("Message must be between 1 and 5000 characters"),
  ],
  validate,
  sendCorporateEmail
);

router.post(
  "/auth/send-verification-email",
  authLimiter,
  protect,
  sendVerificationLink
);

router.post("/auth/verify-email", authLimiter, verifyEmailToken);

// Reset Password Link and Update Password routes can be added here
router.post(
  "/auth/forgot-password",
  authLimiter,
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email to reset password"),
  ],
  validate,
  forgotPassword
);

router.post(
  "/auth/reset-password",
  authLimiter,
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters long"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  validate,
  resetPassword
);
router.post("/auth/verify-reset-password", authLimiter, verifyResetToken);

export default router;
