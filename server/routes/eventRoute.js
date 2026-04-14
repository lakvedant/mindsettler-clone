import express from "express";
import { body } from "express-validator";
import {
  createEvent,
  deleteEvent,
  getAllEventsAdmin,
  getPublishedEvents,
  updateEvent,
} from "../controllers/eventController.js";
import { protect } from "../middlewares/userMiddleware.js";
import { admin } from "../middlewares/adminMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/", getPublishedEvents);

router.get("/admin/all", protect, admin, getAllEventsAdmin);

router.post(
  "/admin/create",
  protect,
  admin,
  [
    body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title must be 3-120 characters"),
    body("description")
      .trim()
      .isLength({ min: 20, max: 1200 })
      .withMessage("Description must be 20-1200 characters"),
    body("eventDate").isISO8601().withMessage("Valid event date is required"),
    body("therapistName")
      .trim()
      .isLength({ min: 3, max: 80 })
      .withMessage("Therapist name must be 3-80 characters"),
  ],
  validate,
  createEvent
);

router.patch("/admin/update/:id", protect, admin, updateEvent);
router.delete("/admin/delete/:id", protect, admin, deleteEvent);

export default router;
