"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMockAnnotations = generateMockAnnotations;
function generateMockAnnotations(videoId) {
    const mock = [];
    const types = ['face', 'license_plate'];
    for (let i = 0; i < 10; i++) {
        mock.push({
            videoId,
            frameNumber: Math.floor(Math.random() * 1000),
            x: Math.random() * 640,
            y: Math.random() * 480,
            width: Math.random() * 100 + 20,
            height: Math.random() * 100 + 20,
            type: types[Math.floor(Math.random() * types.length)]
        });
    }
    return mock;
}
