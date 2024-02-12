import { Router } from "express";
import asyncHandler from "../minddleware/asyncHandler";
import { articleController } from "../controllers/articles";

const route = Router();

route.post("/create", asyncHandler(articleController.createArticle));

export default route;
