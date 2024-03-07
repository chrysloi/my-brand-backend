import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { Authorization } from "../middleware/auth";
import { MessageController } from "../controllers/message";
import { MessageMiddleware } from "../middleware/message.middleware";

const route = Router();

route.post(
  "/send",
  asyncHandler(MessageMiddleware.sendMessageValidation),
  asyncHandler(MessageController.sendMessage)
);

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
