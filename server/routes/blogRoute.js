import express from "express";
import { getBlogs, getBlogById, getCategories, addCategory, deleteCategory, addBlog, updateBlog, deleteBlog } from "../controllers/blogController.js";
import { protect } from "../middlewares/userMiddleware.js";
import { admin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/categories", getCategories);
router.get("/:id", getBlogById);

router.post("/category", protect, admin, addCategory);
router.delete("/category/:id", protect, admin, deleteCategory);
router.post("/", protect, admin, addBlog);
router.put("/:id", protect, admin, updateBlog);
router.delete("/:id", protect, admin, deleteBlog);

export default router;
