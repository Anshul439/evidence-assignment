import express from "express";
import { uploadMiddleware } from "../middleware/upload";
import {
  uploadVideo,
  getStatus,
  getAnnotations,
  updateAnnotations,
} from "../controllers/videoController";

const router = express.Router();

router.post("/", uploadMiddleware, uploadVideo);
router.get("/:videoId/status", getStatus);
router.get("/:videoId/annotations", getAnnotations);
router.put("/:videoId/annotations", updateAnnotations);

export default router;
