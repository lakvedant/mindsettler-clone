import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    eventDate: { type: Date, required: true },
    durationMinutes: { type: Number, default: 90, min: 30, max: 600 },
    location: { type: String, trim: true, default: "Online" },
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "online",
    },
    therapistName: { type: String, required: true, trim: true, maxlength: 80 },
    category: {
      type: String,
      enum: ["workshop", "group-therapy", "webinar", "awareness-drive", "retreat"],
      default: "workshop",
    },
    highlights: [{ type: String, trim: true, maxlength: 140 }],
    capacity: { type: Number, default: null, min: 1, max: 10000 },
    registrationLink: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "published",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
