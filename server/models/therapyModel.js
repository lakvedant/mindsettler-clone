import mongoose from "mongoose";

const therapySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Therapy = mongoose.model("Therapy", therapySchema);
export default Therapy;
