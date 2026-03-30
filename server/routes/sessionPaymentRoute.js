import express from "express";
import {
  submitSessionPayment,
  getPendingPayments,
  getUserPayments,
  approvePayment,
  rejectPayment,
  getAllPayments,
} from "../controllers/sessionPaymentController.js";
import { admin } from "../middlewares/adminMiddleware.js";
import { isProfileComplete } from "../middlewares/userMiddleware.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// User routes
router.post(
  "/submit",
  isProfileComplete,
  [
    body("appointmentId")
      .isMongoId()
      .withMessage("Valid appointment ID is required"),
    body("utrNumber")
      .trim()
      .isLength({ min: 12, max: 20 })
      .withMessage("UTR number must be 12-20 characters long")
      .matches(/^[A-Z0-9]+$/)
      .withMessage("UTR number must contain only uppercase letters and numbers"),
  ],
  validate,
  submitSessionPayment
);

router.get("/my-payments", isProfileComplete, getUserPayments);

// Admin routes
router.get("/pending", admin, getPendingPayments);
router.get("/", admin, getAllPayments);
router.patch("/approve/:id", admin, approvePayment);
router.patch(
  "/reject/:id",
  admin,
  [
    body("rejectionReason")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Rejection reason must be less than 500 characters"),
  ],
  validate,
  rejectPayment
);

export default router;
