import mongoose from "mongoose";

// Session Payment Schema: Records payment for each session via manual UTR
const sessionPaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    utrNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[A-Z0-9]{12,20}$/, "UTR number must be 12-20 alphanumeric characters"],
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const SessionPayment = mongoose.model("SessionPayment", sessionPaymentSchema);
