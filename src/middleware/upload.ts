import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/error";

const allowedMimeTypes = [
  "video/mp4",
  "video/mkv",
  "video/avi",
  "video/quicktime",
];

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"));
  }
};

const rawUpload = multer({ storage, fileFilter });

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  rawUpload.single("video")(req, res, (err) => {
    if (err) {
      sendError(res, 404, err.message);
    }
    next();
  });
};
