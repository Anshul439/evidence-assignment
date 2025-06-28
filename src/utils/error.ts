import { Response } from "express";

export const sendError = (res: Response, status: number, message: string) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

export const sendSuccess = (
  res: Response,
  status: number,
  data: any,
  message?: string
) => {
  const response: any = {
    success: true,
    data,
  };

  if (message) response.message = message;

  return res.status(status).json(response);
};
