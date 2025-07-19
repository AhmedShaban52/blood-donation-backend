import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Register
export const register = async (req, res) => {
  const { name, email, password, bloodType, address } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      bloodType,
      address,
    });

    res.status(201).json({
      message: "Registered successfully",
      status: 201,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "The password is incorrect" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ token, message: "Successful login", status: 200 });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    // تقليل طول الرمز إلى 20 بايت (40 حرف)
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // إرجاع الرمز نفسه للاختبار (بدون تشفير)
    res.status(200).json({
      status: "success",
      message: "use the link below to reset your password",
      resetToken, // إرجاع الرمز غير المشفر للاختبار
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "token is invalid or has expired",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "password has been reset successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

// Log Out
export const logout = (req, res) => {
  res.status(200).json({ message: "User logged out" });
};
