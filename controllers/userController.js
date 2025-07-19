import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not exist" });
    }

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

// update Profile
export const updateProfile = async (req, res) => {
  try {
    const oldUser = await User.findById(req.user.id).select("-password");
    if (!oldUser) return res.status(404).json({ message: "User not found" });

    const cleanedBody = {};
    for (const [key, value] of Object.entries(req.body)) {
      cleanedBody[key.trim()] = value;
    }

    const { firstName, lastName, email, phoneNumber, address } = cleanedBody;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (address) updates.address = address;

    if (email && email !== oldUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      updates.email = email;
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile-pictures",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });
      updates.profilePicture = result.secure_url;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: "-password -resetPasswordToken -resetPasswordExpire -__v",
      }
    );

    const responseData = {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      profilePicture: updatedUser.profilePicture,
      role: updatedUser.role,
      bloodType: updatedUser.bloodType,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
