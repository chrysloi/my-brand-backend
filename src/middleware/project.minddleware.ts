import { NextFunction, Response } from "express";
import { ProjectRequest } from "../types";
import { project } from "../models/projectModel";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import Joi from "joi";
import { JsonResponse } from "../util/jsonResponse";

class Middleware {
  async createProject(req: ProjectRequest, res: Response, next: NextFunction) {
    const createprojectSchema = Joi.object({
      title: Joi.string().min(5).required(),
      summary: Joi.string().min(15).required(),
      detailed: Joi.string().min(15).required(),
      coverImage: Joi.string().min(5).optional(),
    });

    const { value, error } = createprojectSchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }
    req.body = value;
    next();
  }

  async updateProject(req: ProjectRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { userId } = req.user;

    const projectExists = await project.findOne({ owner: userId, _id: id });

    if (!projectExists) {
      return JsonResponse(res, {
        status: NOT_FOUND,
        error: "Project Doesn't exists or you're not the owner",
      });
    }

    const updateProjectSchema = Joi.object({
      title: Joi.string().min(5).optional(),
      summary: Joi.string().min(15).optional(),
      detailed: Joi.string().min(15).optional(),
      coverImage: Joi.string().min(5).optional(),
    });

    const { value, error } = updateProjectSchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }
    req.project = projectExists;
    req.body = value;
    next();
  }

  async emptyBody(req: ProjectRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { userId } = req.user;
    const emptyBodySchema = Joi.object({});

    const { error } = emptyBodySchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }

    next();
  }

  async projectExists(req: ProjectRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { userId } = req.user;
    const projectExists = await project.findOne({ owner: userId, _id: id });

    if (!projectExists) {
      return JsonResponse(res, {
        status: NOT_FOUND,
        message: "Project Doesn't exists or you're not the owner",
      });
    }
    req.project = projectExists;
    next();
  }
}

export const ProjectMiddleware = new Middleware();
