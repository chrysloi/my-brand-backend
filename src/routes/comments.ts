import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { commentController } from "../controllers/comments";
import { Authorization } from "../middleware/auth";

const route = Router();

route.post(
  "/comment/:articleId",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(commentController.comment)
);
route.patch(
  "/one/:commentId",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(commentController.updateComment)
);
route.get(
  "/article/:articleId",
  asyncHandler(commentController.getArticleComments)
);
route.delete(
  "/article/:articleId/:commentId",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(commentController.deleteArticleComments)
);

export default route;
