import { Worker } from "bullmq";
import IORedis from "ioredis";
import { generateMockAnnotations } from "./utils/annotationMock";
import { prisma } from "./utils/prisma";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

new Worker(
  "video-processing",
  async (job) => {
    const { videoId } = job.data;
    await prisma.video.update({
      where: { id: videoId },
      data: { status: "PROCESSING" },
    });

    await new Promise((res) => setTimeout(res, 20000));

    const annotations = generateMockAnnotations(videoId);
    await prisma.annotation.createMany({ data: annotations });

    await prisma.video.update({
      where: { id: videoId },
      data: { status: "COMPLETE" },
    });
  },
  { connection }
);
