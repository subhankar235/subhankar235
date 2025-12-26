import express from "express";
import protect from "../middleware/authMiddleware.js";
import isSeller from "../middleware/roleMiddleware.js";
import {
  createTemplate,
  getTemplateBazaar,
  useTemplate
} from "../controllers/templateController.js";

const router = express.Router(); // ✅ THIS WAS MISSING

// ===============================
// SELLER creates template
// ===============================
router.post(
  "/",
  protect,     // 1️⃣ must be logged in
  isSeller,    // 2️⃣ must be seller
  createTemplate
);

// ===============================
// USER sees template bazaar
// ===============================
router.get(
  "/home",
  getTemplateBazaar // public route
);

// ===============================
// USER uses a template
// ===============================
router.post(
  "/:id/use",
  protect,     // must be logged in
  useTemplate
);

export default router;
