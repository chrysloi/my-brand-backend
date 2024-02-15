import { NextFunction, Response } from "express";
import { ProjectRequest } from "../types";
import { project } from "../models/projectModel";
import { NOT_FOUND } from "http-status";

class Middleware {
  async projectExists(req: ProjectRequest, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { userId } = req.user;
    const projectExists = await project.findOne({ owner: userId, _id: id });

    if (!projectExists) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Project Doesn't exists or you're not the owner" });
    }
    req.project = projectExists;
    next();
  }
}

export const ProjectMiddleware = new Middleware();
