import express from "express";
import { getTherapies, addTherapy, deleteTherapy } from "../controllers/therapyController.js";
import { protect } from '../middlewares/userMiddleware.js';
import { admin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get("/", getTherapies);
router.post("/add", protect, admin, addTherapy);
router.delete("/delete/:id", protect, admin, deleteTherapy);

export default router;
