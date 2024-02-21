import { NextFunction } from "express";
import { JsonResponse } from "../util/jsonResponse";
import { INTERNAL_SERVER_ERROR } from "http-status";

export default (cb: any) => async (req: any, res: any, next: NextFunction) => {
  try {
    await cb(req, res, next);
  } catch (error: Error | any) {
    console.log(error);
    return JsonResponse(res, {
      status: INTERNAL_SERVER_ERROR,
      error: true,
      message: error?.errors
        ? error?.errors[0]?.message
        : error?.message
        ? error?.message
        : "Internal server error",
    });
  }
};
