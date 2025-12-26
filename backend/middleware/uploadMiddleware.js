// Multer is a middleware that can read files from requestsimport multer from "multer";

//that'why we r doing multer work befor the cloudinary

import path from "path";
import multer from "multer";

const storage = multer.diskStorage({});
//have to image--
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

//now upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
