import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { commentController } from "../controllers/comments";
import { isAuthenticated } from "../middleware/auth";

const route = Router();

route.post("/comment/:articleId", asyncHandler(commentController.comment));
route.patch("/one/:commentId", asyncHandler(commentController.updateComment));
route.get(
  "/article/:articleId",
  asyncHandler(commentController.getArticleComments)
);
route.delete(
  "/article/:articleId/:commentId",
  asyncHandler(isAuthenticated),
  asyncHandler(commentController.deleteArticleComments)
);

export default route;
