"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../middleware/upload");
const videoController_1 = require("../controllers/videoController");
const router = express_1.default.Router();
router.post("/", upload_1.uploadMiddleware, videoController_1.uploadVideo);
router.get("/:videoId/status", videoController_1.getStatus);
router.get("/:videoId/annotations", videoController_1.getAnnotations);
router.put("/:videoId/annotations", videoController_1.updateAnnotations);
exports.default = router;
