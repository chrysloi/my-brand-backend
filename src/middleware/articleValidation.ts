import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "http-status";
import Joi from "joi";
import { AuthRequest } from "../types";
import { JsonResponse } from "../util/jsonResponse";

// export const articleEmptyBodySchema = Joi.object({});

class Middeware {
  async createArticle(req: AuthRequest, res: Response, next: NextFunction) {
    const createArticleSchema = Joi.object({
      title: Joi.string().min(5).required(),
      summary: Joi.string().min(15).required(),
      detailed: Joi.string().min(15).required(),
      coverImage: Joi.string().min(5).optional(),
    });

    const { value, error } = createArticleSchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }
    req.body = { ...value };
    next();
  }

  async updateArticle(req: AuthRequest, res: Response, next: NextFunction) {
    const updateArticleSchema = Joi.object({
      title: Joi.string().min(5).optional(),
      summary: Joi.string().min(15).optional(),
      detailed: Joi.string().min(15).optional(),
      coverImage: Joi.string().min(5).optional(),
    });

    const { value, error } = updateArticleSchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }

    req.body = value;
    next();
  }

  async emptyBody(req: AuthRequest, res: Response, next: NextFunction) {
    const updateArticleSchema = Joi.object({});

    const { error } = updateArticleSchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }

    next();
  }
}

export const ArticleMiddleware = new Middeware();
