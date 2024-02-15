import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { projectController } from "../controllers/projects";
import { isAuthenticated } from "../middleware/auth";
import { ProjectMiddleware } from "../middleware/project.minddleware";

const route = Router();

route.post(
  "/create",
  asyncHandler(isAuthenticated),
  asyncHandler(projectController.createProject)
);

route.get(
  "/user/all",
  asyncHandler(isAuthenticated),
  asyncHandler(projectController.getUserAllProjects)
);

route.get("/all", asyncHandler(projectController.getAllProjects));

route.get("/one/:id", asyncHandler(projectController.getOneProject));

route.patch(
  "/one/:id/update",
  asyncHandler(isAuthenticated),
  asyncHandler(ProjectMiddleware.projectExists),
  asyncHandler(projectController.updateProject)
);

route.patch(
  "/one/:id/publish",
  asyncHandler(isAuthenticated),
  asyncHandler(ProjectMiddleware.projectExists),
  asyncHandler(projectController.publishProject)
);

route.patch(
  "/one/:id/unpublish",
  asyncHandler(isAuthenticated),
  asyncHandler(ProjectMiddleware.projectExists),
  asyncHandler(projectController.unPublishProject)
);

route.delete(
  "/one/:id/delete",
  asyncHandler(isAuthenticated),
  asyncHandler(ProjectMiddleware.projectExists),
  asyncHandler(projectController.deleteProject)
);

export default route;
