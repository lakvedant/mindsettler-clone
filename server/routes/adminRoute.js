import express from 'express';
import { body } from "express-validator";
import { protect } from '../middlewares/userMiddleware.js';
import { getPendingAppointments, setAvailability, broadcastAvailability, profileUpdate, createAdmin, adminLogin } from '../controllers/adminController.js';
import { admin, requirePrimaryAdmin, validateAvailability } from '../middlewares/adminMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  validate,
  adminLogin
);

// middleware to protect routes
router.use(protect, admin);

// User routes
router.post('/create-admin', requirePrimaryAdmin, createAdmin);
router.post('/set-availability', validateAvailability, setAvailability);
router.post('/broadcast-availability', broadcastAvailability);
router.get('/pending-appointments', getPendingAppointments);
router.patch("/profile", protect,
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
  validate, profileUpdate);

export default router;