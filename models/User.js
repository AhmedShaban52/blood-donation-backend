import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profilePicture: { type: String },
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
    address: { type: String },
    phoneNumber: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
