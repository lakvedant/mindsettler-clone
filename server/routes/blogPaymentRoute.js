import express from "express";
import { submitBlogPayment, getMyBlogPayments, getPendingBlogPayments, updateBlogPaymentStatus } from "../controllers/blogPaymentController.js";
import { protect } from "../middlewares/userMiddleware.js";
import { admin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/submit", protect, submitBlogPayment);
router.get("/my-payments", protect, getMyBlogPayments);
router.get("/pending", protect, admin, getPendingBlogPayments);
router.patch("/status/:id", protect, admin, updateBlogPaymentStatus);

export default router;
