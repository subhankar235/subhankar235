import express from "express";
import { protect } from "../middleware/auth.js";
import { getProfile } from "../controller/userController.js";

const router = express.Router();

// Protected user route
router.use(protect);

router.get("/profile", getProfile);

export default router;
