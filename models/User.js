import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    imageUrl: { type: String },

    role: {
      type: String,
      enum: ["donor", "recipient", "admin"],
      default: "donor",
    },

    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: function () {
        return this.role === "donor";
      },
    },
    location: { type: String },
    lastDonationDate: { type: Date },
    healthStatus: { type: String },
    isAvailableToDonate: { type: Boolean, default: true },

    consentToShare: { type: Boolean, default: false },
    notificationToken: { type: String },

    donationHistory: [
      {
        date: Date,
        location: String,
        hospital: String,
        recipientId: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
