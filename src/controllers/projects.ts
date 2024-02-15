import { Request, Response } from "express";
import { project } from "../models/projectModel";
import { CREATED, OK, NOT_FOUND, BAD_REQUEST } from "http-status";
import { AuthRequest, ProjectRequest } from "../types";

class Controller {
  async createProject(req: any, res: Response) {
    const { userId } = req.user;
    const newProject = await project.create({ ...req.body, owner: userId });

    return res
      .status(CREATED)
      .json({ newProject, message: "Project created successfully" });
  }

  async getUserAllProjects(req: AuthRequest, res: Response) {
    const { userId } = req.user;
    const { status } = req.query;
    let conditions: any = { owner: userId };
    if (status === "published") {
      conditions = { ...conditions, is_published: true };
    } else if (status === "unpublished") {
      conditions = { ...conditions, is_published: false };
    }

    const projects = await project.find(conditions);

    if (projects.length === 0) {
      return res
        .status(NOT_FOUND)
        .json({ projects, message: "There're no projects currently" });
    }

    return res
      .status(OK)
      .json({ projects, message: "Projects fetched successfully" });
  }

  async getAllProjects(req: Request, res: Response) {
    const projects = await project.find({ is_published: true });

    return res
      .status(OK)
      .json({ projects, message: "Projects fetched successfully" });
  }

  async getOneProject(req: Request, res: Response) {
    const { id } = req.params;
    const fetchedProject = await project.findById(id);

    if (!fetchedProject) {
      return res.status(NOT_FOUND).json({ message: "Project Doesn't exists." });
    }

    return res.status(OK).json({
      project: fetchedProject,
      message: "Project fetched successfully",
    });
  }

  async updateProject(req: ProjectRequest, res: Response) {
    const { _id: id } = req.project;
    await project.findByIdAndUpdate(id, { ...req.body });

    return res
      .status(CREATED)
      .json({ message: "Project updated successfully" });
  }

  async publishProject(req: ProjectRequest, res: Response) {
    const { _id: id, is_published } = req.project;

    if (is_published) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Project is already published" });
    }

    await project.findByIdAndUpdate(id, { is_published: true });

    return res
      .status(CREATED)
      .json({ message: "Project published successfully" });
  }

  async unPublishProject(req: ProjectRequest, res: Response) {
    const { _id: id, is_published } = req.project;

    if (!is_published) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Project is already unpublished" });
    }

    await project.findByIdAndDelete(id, { is_published: false });

    return res
      .status(CREATED)
      .json({ message: "Project unpublished successfully" });
  }

  async deleteProject(req: ProjectRequest, res: Response) {
    const { _id: id, is_published } = req.project;

    if (is_published) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "You have to first unpublish the project" });
    }

    await project.findByIdAndDelete(id);

    return res
      .status(CREATED)
      .json({ message: "Project deleted successfully" });
  }
}

export const projectController = new Controller();
