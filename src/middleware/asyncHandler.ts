import { NextFunction } from "express";

export default (cb: any) => async (req: any, res: any, next: NextFunction) => {
  try {
    await cb(req, res, next);
  } catch (error: Error | any) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error?.errors
        ? error?.errors[0]?.message
        : error?.message ?? "Internal server error",
    });
  }
};
