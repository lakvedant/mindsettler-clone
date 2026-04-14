import { BlogPayment } from "../models/blogPaymentModel.js";
import Blog from "../models/blogModel.js";

// @desc    Submit a payment UTR for a blog
// @route   POST /api/blog-payment/submit
// @access  Private
export const submitBlogPayment = async (req, res) => {
  try {
    const { blogId, utrNumber } = req.body;
    
    if (!blogId || !utrNumber) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    if (!blog.isPaid) {
      return res.status(400).json({ success: false, message: "This blog is free." });
    }

    const duplicateUTR = await BlogPayment.findOne({ utrNumber: utrNumber.toUpperCase() });
    if (duplicateUTR) {
      return res.status(400).json({ success: false, message: "This UTR number has already been used." });
    }

    const payment = await BlogPayment.create({
      user: req.user._id,
      blog: blogId,
      amount: blog.price,
      utrNumber: utrNumber.toUpperCase(),
      status: "pending"
    });

    res.status(201).json({ success: true, message: "Payment submitted successfully. Please wait for admin approval.", data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's blog payments (to verify if they unlocked it)
// @route   GET /api/blog-payment/my-payments
// @access  Private
export const getMyBlogPayments = async (req, res) => {
  try {
    const payments = await BlogPayment.find({ user: req.user._id });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all pending blog payments (Admin)
// @route   GET /api/blog-payment/pending
// @access  Private/Admin
export const getPendingBlogPayments = async (req, res) => {
  try {
    const payments = await BlogPayment.find({ status: "pending" }).populate("user", "name email").populate("blog", "title");
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog payment status
// @route   PATCH /api/blog-payment/status/:id
// @access  Private/Admin
export const updateBlogPaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await BlogPayment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, message: `Payment ${status}`, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
