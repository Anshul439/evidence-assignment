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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const annotationMock_1 = require("./utils/annotationMock");
const prisma_1 = require("./utils/prisma");
const connection = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
});
new bullmq_1.Worker("video-processing", (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = job.data;
    yield prisma_1.prisma.video.update({
        where: { id: videoId },
        data: { status: "PROCESSING" },
    });
    yield new Promise((res) => setTimeout(res, 20000));
    const annotations = (0, annotationMock_1.generateMockAnnotations)(videoId);
    yield prisma_1.prisma.annotation.createMany({ data: annotations });
    yield prisma_1.prisma.video.update({
        where: { id: videoId },
        data: { status: "COMPLETE" },
    });
}), { connection });
