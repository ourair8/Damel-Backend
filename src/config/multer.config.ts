import type { Request } from "express";
import multer from "multer";

const imageUpload = multer({
  storage: multer.memoryStorage(), // Store files in memory, not on disk
  fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const mimetypes = ["image/png", "image/jpg", "image/jpeg"];
    if (mimetypes.includes(file.mimetype)) {
      callback(null, true); // Accept the file
    } else {
      callback(new Error(`Only ${mimetypes.join(", ")} are allowed to upload!`)); // Reject the file
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export default {
  image: imageUpload,
};
