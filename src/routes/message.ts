import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { Authorization } from "../middleware/auth";
import { MessageController } from "../controllers/message";

const route = Router();

route.post("/send", asyncHandler(MessageController.sendMessage));

route.get(
  "/all",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(Authorization.isAdmin),
  asyncHandler(MessageController.getAllMessages)
);

route.get(
  "/one/:id",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(Authorization.isAdmin),
  asyncHandler(MessageController.readMessage)
);

export default route;
