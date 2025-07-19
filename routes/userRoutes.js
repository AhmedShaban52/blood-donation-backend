import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";
import upload from "../configs/multer.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.patch(
  "/updateProfile",
  protect,
  upload.single("profilePicture"),
  updateProfile
);
export default router;
