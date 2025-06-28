"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const error_1 = require("../utils/error");
const allowedMimeTypes = [
    "video/mp4",
    "video/mkv",
    "video/avi",
    "video/quicktime",
];
const storage = multer_1.default.diskStorage({
    destination: (_, __, cb) => {
        const uploadDir = "uploads";
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${(0, uuid_1.v4)()}${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only video files are allowed!"));
    }
};
const rawUpload = (0, multer_1.default)({ storage, fileFilter });
const uploadMiddleware = (req, res, next) => {
    rawUpload.single("video")(req, res, (err) => {
        if (err) {
            (0, error_1.sendError)(res, 404, err.message);
        }
        next();
    });
};
exports.uploadMiddleware = uploadMiddleware;
