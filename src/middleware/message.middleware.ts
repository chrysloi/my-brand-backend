import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "http-status";
import Joi from "joi";
import { JsonResponse } from "../util/jsonResponse";

class Middeware {
  async sendMessageValidation(req: Request, res: Response, next: NextFunction) {
    const messageSchema = Joi.object({
      fullName: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      subject: Joi.string().min(3).required(),
      message: Joi.string().min(10).required(),
    });
    const { value, error } = messageSchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }
    req.body = value;
    next();
  }
}

export const MessageMiddleware = new Middeware();
