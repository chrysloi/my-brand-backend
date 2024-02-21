import { Response } from "express";

export const JsonResponse = (res: Response, data: any) => {
  return res.status(data.status).json({ ...data });
};
