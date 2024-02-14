import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { userController } from "../controllers/user";

const route = Router();

route.post("/register", asyncHandler(userController.register));
route.post("/login", asyncHandler(userController.login));

export default route;
