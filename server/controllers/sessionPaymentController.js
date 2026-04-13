import { SessionPayment } from "../models/transactionModel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import { Availability } from "../models/adminModel.js";
import Therapy from "../models/therapyModel.js";
import { sendSessionPaymentConfirmationEmail, sendSessionPaymentApprovedEmail, sendSessionPaymentRejectedEmail } from "../utils/emailService.js";

/**
 * @desc    Submit payment for a booked session via UTR number
 * @route   POST /api/session-payments/submit
 * @access  Private
 */
export const submitSessionPayment = async (req, res) => {
  try {
    const { appointmentId, utrNumber, notes } = req.body;

    // 1. Validation
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required." });
    }

    if (!utrNumber || utrNumber.trim().length < 12) {
      return res.status(400).json({ 
        message: "Valid UTR number (12-20 characters) is required." 
      });
    }

    // 2. Check if appointment exists and belongs to user
    const appointment = await Appointment.findById(appointmentId)
      .populate("user", "name email")
      .populate("availabilityRef", "date");

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found." 
      });
    }

    if (appointment.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized: This appointment does not belong to you." 
      });
    }

    if (appointment.sessionType !== "online") {
      return res.status(400).json({
        success: false,
        message: "UTR submission is only required for online sessions.",
      });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot submit payment for a ${appointment.status} appointment.`,
      });
    }

    // 3. Check if payment already exists for this appointment
    const existingPayment = await SessionPayment.findOne({ 
      appointment: appointmentId,
      status: { $in: ["pending", "approved"] }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        success: false,
        message: "Payment already submitted for this appointment." 
      });
    }

    // 4. Check if this UTR was already used (fraud prevention)
    const duplicateUTR = await SessionPayment.findOne({ utrNumber: utrNumber.toUpperCase() });
    if (duplicateUTR) {
      return res.status(400).json({ 
        success: false,
        message: "This UTR number has already been used." 
      });
    }

    // 5. Create the payment record
    const therapy = await Therapy.findOne({ name: appointment.therapyType });
    const sessionAmount = therapy ? therapy.amount : Number(process.env.SESSION_PRICE || 500);

    const payment = await SessionPayment.create({
      user: req.user._id,
      appointment: appointmentId,
      amount: sessionAmount,
      utrNumber: utrNumber.toUpperCase(),
      notes: notes || "",
      status: "pending"
    });

    appointment.sessionPaymentRef = payment._id;
    await appointment.save();

    // 6. Send confirmation email
    try {
      await sendSessionPaymentConfirmationEmail(appointment.user.email, {
        userName: appointment.user.name,
        appointmentId: appointmentId.toString(),
        sessionPrice: sessionAmount,
        utrNumber: utrNumber.toUpperCase(),
        date: appointment.availabilityRef?.date,
        timeSlot: appointment.timeSlot
      });
    } catch (emailError) {
      console.error("Failed to send payment confirmation email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Payment submitted successfully. Please wait for admin approval.",
      data: payment
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Get all pending session payments (Admin only)
 * @route   GET /api/session-payments/pending
 * @access  Private/Admin
 */
export const getPendingPayments = async (req, res) => {
  try {
    const payments = await SessionPayment.find({ status: "pending" })
      .populate("user", "name email phone")
      .populate({
        path: "appointment",
        select: "therapyType sessionType timeSlot availabilityRef",
        populate: { path: "availabilityRef", select: "date" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: payments.length, 
      data: payments 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Get user's session payments
 * @route   GET /api/session-payments/my-payments
 * @access  Private
 */
export const getUserPayments = async (req, res) => {
  try {
    const payments = await SessionPayment.find({ user: req.user._id })
      .populate("appointment", "therapyType sessionType timeSlot")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: payments.length, 
      data: payments 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Approve a pending session payment (Admin only)
 * @route   PATCH /api/session-payments/approve/:id
 * @access  Private/Admin
 */
export const approvePayment = async (req, res) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const payment = await SessionPayment.findById(req.params.id).session(session);

    if (!payment) {
      await session.abortTransaction();
      return res.status(404).json({ 
        success: false,
        message: "Payment not found." 
      });
    }

    if (payment.status !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false,
        message: `Payment is already ${payment.status}.` 
      });
    }

    // Update payment status
    payment.status = "approved";
    await payment.save({ session });

    // Update appointment to mark as paid and confirmed for admin workflow
    await Appointment.findByIdAndUpdate(
      payment.appointment,
      {
        isPaid: true,
        status: "confirmed",
        sessionPaymentRef: payment._id,
      },
      { session }
    );

    // Get user and appointment for email
    const user = await User.findById(payment.user).session(session);
    const appointment = await Appointment.findById(payment.appointment)
      .populate("availabilityRef", "date")
      .session(session);

    await session.commitTransaction();
    session.endSession();

    // Send approval email
    try {
      await sendSessionPaymentApprovedEmail(user.email, {
        userName: user.name,
        appointmentId: appointment._id.toString(),
        sessionPrice: payment.amount,
        date: appointment.availabilityRef?.date,
        timeSlot: appointment.timeSlot
      });
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Payment approved successfully.",
      data: payment
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Reject a pending session payment (Admin only)
 * @route   PATCH /api/session-payments/reject/:id
 * @access  Private/Admin
 */
export const rejectPayment = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const payment = await SessionPayment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: "Payment not found." 
      });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({ 
        success: false,
        message: `Payment is already ${payment.status}.` 
      });
    }

    // Update payment status
    payment.status = "rejected";
    payment.rejectionReason = rejectionReason || "";
    await payment.save();

    // Reject appointment and release the booked slot.
    const appointment = await Appointment.findById(payment.appointment)
      .populate("availabilityRef", "date");

    if (appointment && appointment.status === "pending") {
      appointment.status = "rejected";
      appointment.sessionPaymentRef = payment._id;
      await appointment.save();

      await Availability.updateOne(
        {
          _id: appointment.availabilityRef?._id || appointment.availabilityRef,
          "slots.time": appointment.timeSlot,
        },
        { $set: { "slots.$.isBooked": false } }
      );
    }

    // Get user and appointment for email
    const user = await User.findById(payment.user);

    // Send rejection email
    try {
      await sendSessionPaymentRejectedEmail(user.email, {
        userName: user.name,
        appointmentId: appointment._id.toString(),
        sessionPrice: payment.amount,
        rejectionReason: rejectionReason || "Invalid UTR or payment details",
        date: appointment.availabilityRef?.date,
        timeSlot: appointment.timeSlot
      });
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Payment rejected successfully.",
      data: payment
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * @desc    Get all session payments with filters (Admin only)
 * @route   GET /api/session-payments
 * @access  Private/Admin
 */
export const getAllPayments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const payments = await SessionPayment.find(filter)
      .populate("user", "name email phone")
      .populate({
        path: "appointment",
        select: "therapyType sessionType timeSlot availabilityRef",
        populate: { path: "availabilityRef", select: "date" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: payments.length, 
      data: payments 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
