import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
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
  },
  { timestamps: true }
);

const Doner = mongoose.model("Doner", DonationSchema);

export default Doner;