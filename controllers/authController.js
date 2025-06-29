import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    imageUrl,
    role,
    bloodType,
    location,
    lastDonationDate,
    healthStatus,
    isAvailableToDonate,
    consentToShare,
    donationHistory,
  } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      imageUrl,
      role,
      bloodType,
      location,
      lastDonationDate,
      healthStatus,
      isAvailableToDonate,
      consentToShare,
      donationHistory,
    });

    const obj = newUser.toObject();

    const userData = {
      _id: obj._id,
      name: obj.name,
      email: obj.email,
      imageUrl: obj.imageUrl,
      role: obj.role,
      bloodType: obj.bloodType,
      location: obj.location,
      lastDonationDate: obj.lastDonationDate,
      healthStatus: obj.healthStatus,
      isAvailableToDonate: obj.isAvailableToDonate,
      consentToShare: obj.consentToShare,
      donationHistory: Array.isArray(obj.donationHistory)
        ? obj.donationHistory
        : [],
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };

    res
      .status(201)
      .json({ message: "Registered successfully", user: userData });
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

    const obj = user.toObject();

    const { password: _, donationHistory: __, ...userData } = obj;

    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Log Out
export const logout = (req, res) => {
  res
    .status(200)
    .json({ message: "User logged out (client should remove token)" });
};
