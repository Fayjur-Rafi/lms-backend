import express from "express";
import {
  signup,
  login,
  logout,
  getCurrentUser,
  sendResetOtp,
  resetPassword,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);
router.get("/me", isAuthenticated, getCurrentUser);

export default router;