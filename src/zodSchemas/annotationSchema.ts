import { z } from "zod";

export const annotationSchema = z.object({
  frameNumber: z.number().int().nonnegative(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  type: z.enum(["face", "license_plate"]),
});

export const annotationArraySchema = z.array(annotationSchema);

export type AnnotationInput = z.infer<typeof annotationSchema>;
