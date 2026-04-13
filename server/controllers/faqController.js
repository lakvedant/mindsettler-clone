import FAQ from "../models/faqModel.js";

// @desc    Get all FAQs
// @route   GET /api/faq
// @access  Public
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error fetching FAQs" });
  }
};

// @desc    Add a new FAQ
// @route   POST /api/faq/add
// @access  Private/Admin
export const addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "Please provide both question and answer" });
    }

    const faq = await FAQ.create({ question, answer });
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error adding FAQ" });
  }
};

// @desc    Delete an FAQ
// @route   DELETE /api/faq/delete/:id
// @access  Private/Admin
export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    await FAQ.deleteOne({ _id: req.params.id }); 
    res.status(200).json({ success: true, message: "FAQ removed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error deleting FAQ" });
  }
};
