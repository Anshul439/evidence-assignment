"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotationArraySchema = exports.annotationSchema = void 0;
const zod_1 = require("zod");
exports.annotationSchema = zod_1.z.object({
    frameNumber: zod_1.z.number().int().nonnegative(),
    x: zod_1.z.number(),
    y: zod_1.z.number(),
    width: zod_1.z.number().positive(),
    height: zod_1.z.number().positive(),
    type: zod_1.z.enum(["face", "license_plate"]),
});
exports.annotationArraySchema = zod_1.z.array(exports.annotationSchema);
