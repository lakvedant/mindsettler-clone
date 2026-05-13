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
  createEvent
);

router.patch("/admin/update/:id", protect, admin, updateEvent);
router.delete("/admin/delete/:id", protect, admin, deleteEvent);

export default router;
