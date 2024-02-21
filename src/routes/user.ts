import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { userController } from "../controllers/user";
import { AuthMiddleware } from "../middleware/auth.middeware";

const route = Router();

route.post(
  "/register",
  asyncHandler(AuthMiddleware.registerValidation),
  asyncHandler(userController.register)
);
route.post(
  "/login",
  asyncHandler(AuthMiddleware.loginValidation),
  asyncHandler(userController.login)
);

export default route;
