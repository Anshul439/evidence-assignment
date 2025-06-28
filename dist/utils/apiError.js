"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiError = apiError;
function apiError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
