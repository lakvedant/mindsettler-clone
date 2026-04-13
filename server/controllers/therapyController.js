import Therapy from "../models/therapyModel.js";

// @desc    Get all active therapies
// @route   GET /api/therapy
// @access  Public
export const getTherapies = async (req, res) => {
  try {
    const therapies = await Therapy.find({ isActive: true }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: therapies.length, data: therapies });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error fetching therapies" });
  }
};

// @desc    Add a new therapy type
// @route   POST /api/therapy/add
// @access  Private/Admin
export const addTherapy = async (req, res) => {
  try {
    const { name, amount } = req.body;

    if (!name || amount === undefined) {
      return res.status(400).json({ success: false, message: "Please provide both name and amount" });
    }

    const therapy = await Therapy.create({ name, amount: Number(amount) });
    res.status(201).json({ success: true, data: therapy });
  } catch (error) {
    console.error(error.message);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Therapy type already exists" });
    }
    res.status(500).json({ success: false, message: "Server Error adding therapy" });
  }
};

// @desc    Delete a therapy type
// @route   DELETE /api/therapy/delete/:id
// @access  Private/Admin
export const deleteTherapy = async (req, res) => {
  try {
    const therapy = await Therapy.findById(req.params.id);

    if (!therapy) {
      return res.status(404).json({ success: false, message: "Therapy type not found" });
    }

    await Therapy.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: "Therapy type removed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error deleting therapy" });
  }
};
