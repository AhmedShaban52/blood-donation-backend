import mongoose from "mongoose";

const BloodRequestSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "fulfilled", "expired"],
      default: "open",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number], // [longitude, latitude]
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    viewedBy: [
      {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        viewedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const BloodRequest = mongoose.model("BloodRequest", BloodRequestSchema);

export default BloodRequest;
