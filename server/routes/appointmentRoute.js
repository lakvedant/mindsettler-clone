import express from 'express';
import { bookSession, updateStatus, getMyAppointments, getAvailability, deleteAvailability, flushAvailability, updateMeetLink, rescheduleSession } from '../controllers/appointmentController.js';
import { isProfileComplete, protect } from '../middlewares/userMiddleware.js';
import { admin } from '../middlewares/adminMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Availability is intentionally public so visitors can choose a session time
// before creating an account. Booking itself remains protected below.
router.get('/get-availability', getAvailability);

// All remaining appointment operations require an authenticated user.
router.use(protect);

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array()[0].msg // Returns the first error message
    });
  }
  next();
};

router.post(
  '/book', 
  [
    body('notes')
      .optional({ checkFalsy: true }) // Notes are usually optional
      .isLength({ max: 50 })
      .withMessage('Notes cannot be longer than 50 characters')
  ],
  validateRequest, 
  bookSession
);

// Admin only route
router.patch('/status/:id', admin, updateStatus);
router.patch('/reschedule/:id', isProfileComplete, rescheduleSession);
router.delete('/delete-availability/:id', admin, deleteAvailability);
router.get('/my-sessions', isProfileComplete, getMyAppointments);
router.delete('/flush-availability', admin, flushAvailability);
router.put('/meet-link-update/:id', admin, updateMeetLink);

export default router;
