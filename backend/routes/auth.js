import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} from "../controller/auth-controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
