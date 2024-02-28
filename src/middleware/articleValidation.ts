import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import Joi from "joi";
import { AuthRequest } from "../types";
import { JsonResponse } from "../util/jsonResponse";
import { article } from "../models/articleModel";

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
    const { id } = req.params;
    const { userId } = req.user;
    const updateArticleSchema = Joi.object({
      title: Joi.string().min(5).optional(),
      summary: Joi.string().min(15).optional(),
      detailed: Joi.string().min(15).optional(),
      coverImage: Joi.string().min(5).optional(),
    });

    const articleExist = await article.findOne({ author: userId, _id: id });

    if (!articleExist) {
      return JsonResponse(res, {
        status: NOT_FOUND,
        message: "Article Doesn't exists or you're not the owner",
      });
    }

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

  async articleExists(req: AuthRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { userId } = req.user;
    const articleExist = await article.findById(id);

    if (!articleExist) {
      return JsonResponse(res, {
        status: NOT_FOUND,
        error: "Article Doesn't exists or you're not the owner",
      });
    }
    next();
  }
}

export const ArticleMiddleware = new Middeware();
