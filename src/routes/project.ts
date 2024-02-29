import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { projectController } from "../controllers/projects";
import { Authorization } from "../middleware/auth";
import { ProjectMiddleware } from "../middleware/project.minddleware";

const route = Router();

route.post(
  "/create",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(Authorization.isAdmin),
  asyncHandler(ProjectMiddleware.createProject),
  asyncHandler(projectController.createProject)
);

route.get(
  "/user/all",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(Authorization.isAdmin),
  asyncHandler(projectController.getUserAllProjects)
);

route.get("/all", asyncHandler(projectController.getAllProjects));

route.get("/one/:id", asyncHandler(projectController.getOneProject));

route.patch(
  "/one/:id/update",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(Authorization.isAdmin),
  asyncHandler(ProjectMiddleware.updateProject),
  asyncHandler(projectController.updateProject)
);

route.patch(
  "/one/:id/publish",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(Authorization.isAdmin),
  asyncHandler(ProjectMiddleware.projectExists),
  asyncHandler(ProjectMiddleware.emptyBody),
  asyncHandler(projectController.publishProject)
);

route.patch(
  "/one/:id/unpublish",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(Authorization.isAdmin),
  asyncHandler(ProjectMiddleware.projectExists),
  asyncHandler(ProjectMiddleware.emptyBody),
  asyncHandler(projectController.unPublishProject)
);

// route.delete(
//   "/one/:id/delete",
//   asyncHandler(Authorization.isAuthenticated),
//   asyncHandler(Authorization.isAdmin),
//   asyncHandler(ProjectMiddleware.projectExists),
//   asyncHandler(ProjectMiddleware.emptyBody),
//   asyncHandler(projectController.deleteProject)
// );

export default route;
