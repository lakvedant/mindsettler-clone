import express from 'express';
import { protect } from '../middlewares/userMiddleware.js';
import { getPendingAppointments, setAvailability, broadcastAvailability, profileUpdate } from '../controllers/adminController.js';
import { admin, validateAvailability } from '../middlewares/adminMiddleware.js';
import { body } from "express-validator";
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// middleware to protect routes
router.use(protect, admin);

// User routes
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