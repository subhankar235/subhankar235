import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";
import { deleteNoteImage,replaceNoteImage,uploadNoteImages,uploadNoteBanner,removeNoteBanner } from "../controller/note-controller.js";

import {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} from "../controller/note-controller.js";

const router = express.Router();
  

// 🔐 all note routes protected

router.use(protect); // 🔐 all routes protected

router.post("/", createNote);
router.get("/", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);




// SEARCH + GET NOTES
router.get("/", getNotes);


//upload images--

router.post(
  "/:id/images",
  protect,
  upload.array("images", 5),
  uploadNoteImages
);

//delete image
router.delete(
  "/:noteId/image/:publicId",
  protect,
  deleteNoteImage
);
// add OR replace banner
router.put(
  "/:id/banner",
  protect,
  upload.single("banner"),
  uploadNoteBanner
);

// remove banner
router.delete(
  "/:id/banner",
  protect,
  removeNoteBanner
);


export default router;
