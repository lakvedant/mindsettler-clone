import { Availability } from '../models/adminModel.js';
import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mergeAvailabilitySlots } from "../utils/availability.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const withPrimaryAdminFlag = (user) => {
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    userObj.isPrimaryAdmin =
        userObj.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
    return userObj;
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. This login is for administrators only.",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Your admin account is not verified. Contact the primary administrator.",
                notVerified: true,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        };

        res.cookie("token", token, cookieOptions).status(200).json({
            success: true,
            user: withPrimaryAdminFlag(user),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const setAvailability = async (req, res) => {
    try {
        let { date, slots } = req.body;
        slots = Array.isArray(slots) ? slots : JSON.parse(slots);
        let availability;

        // Optimistic concurrency prevents an admin save from overwriting a
        // booking that was made after the schedule was read.
        for (let attempt = 0; attempt < 3 && !availability; attempt++) {
            const existingAvailability = await Availability.findOne({ date: { $eq: String(date) } });
            const mergedSlots = mergeAvailabilitySlots(
                existingAvailability?.slots || [],
                slots
            );

            if (!existingAvailability) {
                try {
                    availability = await Availability.create({
                        date,
                        slots: mergedSlots,
                        isActive: true,
                    });
                } catch (error) {
                    if (error?.code !== 11000) throw error;
                }
            } else {
                availability = await Availability.findOneAndUpdate(
                    { _id: existingAvailability._id, updatedAt: existingAvailability.updatedAt },
                    { slots: mergedSlots, isActive: true },
                    { new: true, runValidators: true }
                );
            }
        }

        if (!availability) {
            return res.status(409).json({
                message: "The schedule changed while it was being updated. Please try again.",
            });
        }

        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPendingAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('user', 'name email phone')
            .populate('availabilityRef', 'date')
            .sort({ createdAt: -1 });

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

    const user = updatedUser.toObject();
    user.isPrimaryAdmin =
      user.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const broadcastAvailability = async (req, res) => {
    try {
        let { startDate, days, slots } = req.body;
        slots = Array.isArray(slots) ? slots : JSON.parse(slots);
        
        const start = new Date(startDate);
        let createdCount = 0;

        for (let i = 0; i < Number(days); i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);
            const dateString = currentDate.toISOString().split("T")[0];

            const existing = await Availability.findOne({ date: dateString });
            const newSlotsFormatted = slots.map(time => ({ time, isBooked: false }));

            if (existing) {
                // Preserve slots that are already booked
                const bookedSlots = existing.slots.filter(s => s.isBooked);
                const bookedTimes = bookedSlots.map(s => s.time);
                
                // Only add unbooked slots that don't overlap with booked times
                const newlyAdded = newSlotsFormatted.filter(s => !bookedTimes.includes(s.time));

                existing.slots = [...bookedSlots, ...newlyAdded].sort((a,b) => a.time.localeCompare(b.time));
                await existing.save();
                createdCount++;
            } else {
                await Availability.create({
                    date: dateString,
                    slots: newSlotsFormatted,
                    isActive: true
                });
                createdCount++;
            }
        }

        res.status(200).json({ success: true, message: `Successfully published schedule to ${createdCount} days` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields (name, email, password) are required." });
        }

        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "admin",
            isVerified: true,
            verificationExpires: null
        });

        const adminResponse = newAdmin.toObject();
        delete adminResponse.password;

        res.status(201).json({
            success: true,
            message: "Admin created successfully.",
            admin: adminResponse
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
