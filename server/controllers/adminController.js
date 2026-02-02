import { Availability } from '../models/adminModel.js';
import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';

export const setAvailability = async (req, res) => {
    try {
        let { date, slots } = req.body;
        slots = Array.isArray(slots) ? slots : JSON.parse(slots);
        const formattedSlots = slots.map(time => ({
            time,
            isBooked: false
        }));

        const availability = await Availability.findOneAndUpdate(
            { date },
            { slots: formattedSlots, isActive: true },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPendingAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ status:"confirmed" })
            .populate('user', 'name email phone')
            .sort({ date: 1, timeSlot: 1 });

        res.status(200).json({ success: true, count:appointments.length, data: appointments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const profileUpdate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, email, gender } = req.body;
    const updates = {name, phone, email, gender, profileIsComplete: true };

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use by another account." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};