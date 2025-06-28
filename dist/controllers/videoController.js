"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnnotations = exports.getAnnotations = exports.getStatus = exports.uploadVideo = void 0;
const videoQueue_1 = require("../utils/videoQueue");
const annotationSchema_1 = require("../zodSchemas/annotationSchema");
const error_1 = require("../utils/error");
const prisma_1 = require("../utils/prisma");
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            (0, error_1.sendError)(res, 400, "No file uploaded");
            return;
        }
        const video = yield prisma_1.prisma.video.create({
            data: {
                filePath: req.file.path,
                status: "PENDING",
            },
        });
        yield videoQueue_1.videoQueue.add("process", { videoId: video.id });
        (0, error_1.sendSuccess)(res, 202, { videoId: video.id });
    }
    catch (err) {
        console.error(err);
        (0, error_1.sendError)(res, 500, "Internal server error");
    }
});
exports.uploadVideo = uploadVideo;
const getStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const video = yield prisma_1.prisma.video.findUnique({ where: { id: videoId } });
        if (!video) {
            (0, error_1.sendError)(res, 404, "Video not found");
            return;
        }
        (0, error_1.sendSuccess)(res, 200, { status: video.status });
    }
    catch (err) {
        (0, error_1.sendError)(res, 500, "Internal server error");
    }
});
exports.getStatus = getStatus;
const getAnnotations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const video = yield prisma_1.prisma.video.findUnique({ where: { id: videoId } });
        if (!video) {
            (0, error_1.sendError)(res, 404, "Video not found");
            return;
        }
        if (video.status !== "COMPLETE") {
            (0, error_1.sendError)(res, 400, "Video processing not complete");
            return;
        }
        const annotations = yield prisma_1.prisma.annotation.findMany({
            where: { videoId },
        });
        (0, error_1.sendSuccess)(res, 200, { annotations });
    }
    catch (err) {
        (0, error_1.sendError)(res, 500, "Internal server error");
    }
});
exports.getAnnotations = getAnnotations;
const updateAnnotations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const { annotations } = req.body;
        const parsed = annotationSchema_1.annotationArraySchema.safeParse(annotations);
        if (!parsed.success) {
            const firstIssue = parsed.error.errors[0];
            const index = typeof firstIssue.path[0] === "number" ? firstIssue.path[0] + 1 : null;
            const field = firstIssue.path[1] || firstIssue.path[0] || "unknown";
            let message = index
                ? `Annotation ${index}: ${firstIssue.message.replace("Required", `Missing required field '${field}'`)}`
                : `Field '${field}' ${firstIssue.message.toLowerCase()}`;
            (0, error_1.sendError)(res, 400, message);
            return;
        }
        const video = yield prisma_1.prisma.video.findUnique({ where: { id: videoId } });
        if (!video) {
            (0, error_1.sendError)(res, 404, "Video not found");
            return;
        }
        if (video.status !== "COMPLETE") {
            (0, error_1.sendError)(res, 400, "Cannot update annotations before video is processed");
            return;
        }
        yield prisma_1.prisma.annotation.deleteMany({ where: { videoId } });
        yield prisma_1.prisma.annotation.createMany({
            data: parsed.data.map((a) => (Object.assign(Object.assign({}, a), { videoId }))),
        });
        (0, error_1.sendSuccess)(res, 200, {}, "Annotations updated successfully");
    }
    catch (err) {
        console.error(err);
        (0, error_1.sendError)(res, 500, err instanceof Error ? err.message : "Internal server error");
    }
});
exports.updateAnnotations = updateAnnotations;
