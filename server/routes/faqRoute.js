import express from 'express';
import { protect } from '../middlewares/userMiddleware.js';
import { admin } from '../middlewares/adminMiddleware.js';
import { getFAQs, addFAQ, deleteFAQ } from '../controllers/faqController.js';

const router = express.Router();

router.get('/', getFAQs); // Public
router.post('/add', protect, admin, addFAQ); // Admin only
router.delete('/delete/:id', protect, admin, deleteFAQ); // Admin only

export default router;
