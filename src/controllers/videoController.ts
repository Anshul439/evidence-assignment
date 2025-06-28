import { Request, Response } from "express";
import { videoQueue } from "../utils/videoQueue";
import {
  annotationArraySchema,
  AnnotationInput,
} from "../zodSchemas/annotationSchema";
import { sendError, sendSuccess } from "../utils/error";
import { prisma } from "../utils/prisma";

export const uploadVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file uploaded");
      return;
    }

    const video = await prisma.video.create({
      data: {
        filePath: req.file.path,
        status: "PENDING",
      },
    });

    await videoQueue.add("process", { videoId: video.id });

    sendSuccess(res, 202, { videoId: video.id });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Internal server error");
  }
};

export const getStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const video = await prisma.video.findUnique({ where: { id: videoId } });

    if (!video) {
      sendError(res, 404, "Video not found");
      return;
    }

    sendSuccess(res, 200, { status: video.status });
  } catch (err) {
    sendError(res, 500, "Internal server error");
  }
};

export const getAnnotations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { videoId } = req.params;
    const video = await prisma.video.findUnique({ where: { id: videoId } });

    if (!video) {
      sendError(res, 404, "Video not found");
      return;
    }

    if (video.status !== "COMPLETE") {
      sendError(res, 400, "Video processing not complete");
      return;
    }

    const annotations = await prisma.annotation.findMany({
      where: { videoId },
    });

    sendSuccess(res, 200, { annotations });
  } catch (err) {
    sendError(res, 500, "Internal server error");
  }
};

export const updateAnnotations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { videoId } = req.params;
    const { annotations } = req.body;

    const parsed = annotationArraySchema.safeParse(annotations);
    if (!parsed.success) {
      const firstIssue = parsed.error.errors[0];

      const index =
        typeof firstIssue.path[0] === "number" ? firstIssue.path[0] + 1 : null;
      const field = firstIssue.path[1] || firstIssue.path[0] || "unknown";

      let message = index
        ? `Annotation ${index}: ${firstIssue.message.replace(
            "Required",
            `Missing required field '${field}'`
          )}`
        : `Field '${field}' ${firstIssue.message.toLowerCase()}`;

      sendError(res, 400, message);

      return;
    }

    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      sendError(res, 404, "Video not found");
      return;
    }

    if (video.status !== "COMPLETE") {
      sendError(
        res,
        400,
        "Cannot update annotations before video is processed"
      );
      return;
    }

    await prisma.annotation.deleteMany({ where: { videoId } });
    await prisma.annotation.createMany({
      data: parsed.data.map((a: AnnotationInput) => ({
        ...a,
        videoId,
      })),
    });

    sendSuccess(res, 200, {}, "Annotations updated successfully");
  } catch (err) {
    console.error(err);
    sendError(
      res,
      500,
      err instanceof Error ? err.message : "Internal server error"
    );
  }
};
