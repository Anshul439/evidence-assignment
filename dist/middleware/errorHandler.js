"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (res.headersSent) {
        return next(err);
    }
    res.status(statusCode).json({ error: message });
};
exports.errorHandler = errorHandler;
