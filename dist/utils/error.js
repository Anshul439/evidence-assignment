"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = exports.sendError = void 0;
const sendError = (res, status, message) => {
    return res.status(status).json({
        success: false,
        message,
    });
};
exports.sendError = sendError;
const sendSuccess = (res, status, data, message) => {
    const response = {
        success: true,
        data,
    };
    if (message)
        response.message = message;
    return res.status(status).json(response);
};
exports.sendSuccess = sendSuccess;
