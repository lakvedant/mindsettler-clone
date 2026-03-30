import Appointment from "../models/appointmentModel.js";
import { Availability } from "../models/adminModel.js";
import User from "../models/userModel.js";
import { sendBookingConfirmationEmail, sendSessionRejectedEmail } from "../utils/emailService.js";

// @desc    Book a new session
// @route   POST /api/appointments/book
// @access  Private
export const bookSession = async (req, res) => {
  try {
    const {
      therapyType,
      sessionType,
      timeSlot,
      availabilityRef,
      notes,
    } = req.body;

    // 1. Get User
    const user = await User.findById(req.user._id);

    // 2. Atomically find availability and mark slot as booked
    const availability = await Availability.findOneAndUpdate(
      {
        _id: availabilityRef,
        slots: {
          $elemMatch: {
            time: timeSlot,
            isBooked: false,
          },
        },
      },
      { $set: { "slots.$.isBooked": true } },
      { new: true }
    );

    if (!availability) {
      return res.status(400).json({
        success: false,
        message: "Slot is no longer available or already booked.",
      });
    }

    // Check if slot is expired
    const slotDateTime = new Date(`${availability.date}T${timeSlot}`);
    if (slotDateTime < new Date() || !availability.isActive) {
      // ROLLBACK: Unbook the slot
      await Availability.updateOne(
        { _id: availabilityRef, "slots.time": timeSlot },
        { $set: { "slots.$.isBooked": false } }
      );
      return res.status(400).json({
        success: false,
        message: "Slot is expired",
      });
    }

    // 3. Create the Appointment
    const appointment = await Appointment.create({
      user: req.user._id,
      availabilityRef,
      therapyType,
      sessionType,
      timeSlot,
      notes,
      isPaid: false, // Payment will be handled separately via UTR
      status: sessionType === "online" ? "pending" : "confirmed",
    });

    // 4. Send immediate confirmation only for offline sessions.
    // Online sessions are confirmed after admin approves submitted UTR payment.
    if (sessionType === "offline") {
      try {
        await sendBookingConfirmationEmail(user.email, {
          userName: user.name,
          therapyType,
          sessionType,
          date: availability.date,
          timeSlot,
          bookingId: appointment._id.toString(),
        });
      } catch (emailError) {
        // Log error but don't fail the booking
        console.error("Failed to send booking confirmation email:", emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: "Session booked successfully! Please submit payment via UTR.",
      data: appointment,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update appointment status (Admin Only)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status);

    const appointment = await Appointment.findById(req.params.id).populate(
      "availabilityRef"
    );

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      });
    }

    // Check if appointment is already processed
    if (appointment.status === "rejected" || appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: `Appointment is already ${appointment.status}`,
      });
    }

    // Get user details
    const user = await User.findById(appointment.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle rejection
    if (status === "rejected") {
      // Free up the booked slot
      await Availability.updateOne(
        {
          _id: appointment.availabilityRef._id || appointment.availabilityRef,
          "slots.time": appointment.timeSlot,
        },
        { $set: { "slots.$.isBooked": false } }
      );

      // Send rejection email
      try {
        // Get availability date
        let appointmentDate;
        if (appointment.availabilityRef && appointment.availabilityRef.date) {
          appointmentDate = appointment.availabilityRef.date;
        } else {
          // Fetch availability if not populated
          const availability = await Availability.findById(
            appointment.availabilityRef
          );
          appointmentDate = availability?.date || new Date();
        }

        await sendSessionRejectedEmail(user.email, {
          userName: user.name,
          therapyType: appointment.therapyType,
          sessionType: appointment.sessionType,
          date: appointmentDate,
          timeSlot: appointment.timeSlot,
          bookingId: appointment._id.toString(),
        });
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
        // Don't fail the request if email fails
      }
    }

    // Update appointment status
    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      data: appointment,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc    Get logged in user appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("availabilityRef")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reschedule an existing session (User)
// @route   PATCH /api/appointment/reschedule/:id
// @access  Private
export const rescheduleSession = async (req, res) => {
  try {
    const { availabilityRef, timeSlot, notes } = req.body;

    if (!availabilityRef || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Availability and time slot are required.",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (!["pending", "confirmed"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule a ${appointment.status} session.`,
      });
    }

    // Book the new slot atomically.
    const newAvailability = await Availability.findOneAndUpdate(
      {
        _id: availabilityRef,
        slots: {
          $elemMatch: {
            time: timeSlot,
            isBooked: false,
          },
        },
      },
      { $set: { "slots.$.isBooked": true } },
      { new: true }
    );

    if (!newAvailability) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is no longer available.",
      });
    }

    // Release previous slot.
    await Availability.updateOne(
      {
        _id: appointment.availabilityRef,
        "slots.time": appointment.timeSlot,
      },
      { $set: { "slots.$.isBooked": false } }
    );

    appointment.availabilityRef = availabilityRef;
    appointment.timeSlot = timeSlot;
    if (typeof notes === "string") {
      appointment.notes = notes;
    }
    await appointment.save();

    const updated = await Appointment.findById(appointment._id).populate("availabilityRef");

    return res.status(200).json({
      success: true,
      message: "Session rescheduled successfully.",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getAvailability = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) return res.status(400).json({ success: false, message: "Date is required" });

    // 1. Normalize dates
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ success: false, message: "Past dates are invalid" });
    }

    // 2. Find availability for the date
    const availability = await Availability.findOne({ date, isActive: true });

    if (!availability) {
      return res.status(404).json({ success: false, message: "No slots published" });
    }

    // 3. Filter for slots that are NOT booked
    // Based on your schema: slots: [{ time: "9:00 AM", isBooked: false }]
    const availableSlots = availability.slots
      .filter(slot => !slot.isBooked)
      .map(slot => slot.time); // Convert objects back to strings for the frontend

    return res.status(200).json({ 
      success: true,
      data: { slots: availableSlots, availabilityId: availability._id } 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }
    await availability.deleteOne();
    res.status(200).json({ success: true, message: "Availability deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const flushAvailability = async (req, res) => {
  try {
    // Deleting all availability entries before today
    const today = new Date().toISOString().split("T")[0];
    const result = await Availability.deleteMany({ date: { $lt: today } });

    res.status(200).json({ 
      success: true, 
      message: `Flushed ${result.deletedCount} past availability entries successfully` 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateMeetLink = async (req, res) => {
  try {
    const { meetLink } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.meetLink = meetLink;
    await appointment.save();
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};