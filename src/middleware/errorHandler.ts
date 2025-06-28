import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({ error: message });
};
