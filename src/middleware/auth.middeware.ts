import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "http-status";
import Joi from "joi";
import { JsonResponse } from "../util/jsonResponse";

class Middeware {
  async loginValidation(req: Request, res: Response, next: NextFunction) {
    const loginSchema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }),
      password: Joi.string().min(6),
    });
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }
    req.body = value;
    next();
  }

  async registerValidation(req: Request, res: Response, next: NextFunction) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3),
      email: Joi.string().email({ minDomainSegments: 2 }),
      password: Joi.string().min(6),
    });

    const { value, error } = registerSchema.validate(req.body);

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

export const AuthMiddleware = new Middeware();
