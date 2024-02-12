import { Router } from "express";
import asyncHandler from "../minddleware/asyncHandler";
import { projectController } from "../controllers/projects";

const route = Router();

route.post("/create", asyncHandler(projectController.createProject));

export default route;
