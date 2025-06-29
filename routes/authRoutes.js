import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// اختياري: بيانات المستخدم بعد تسجيل الدخول
router.get("/me", protect, (req, res) => res.json(req.user));

export default router;
