import mongoose from "mongoose";

/**
 * Tracks booking details. Payment is handled via SessionPayment model.
 */
const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    availabilityRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
      required: true,
    },
    therapyType: { type: String, required: true },
    sessionType: { 
      type: String, 
      enum: ["online", "offline"], 
      required: true 
    },
    timeSlot: { type: String, required: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "completed"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: false, // Will be set to true once admin approves the UTR payment
    },
    sessionPaymentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SessionPayment"
    },
    meetLink: { type: String }, // Google Meet link for online sessions
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);