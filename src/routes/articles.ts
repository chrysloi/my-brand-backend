import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { articleController } from "../controllers/articles";
import { Authorization } from "../middleware/auth";
import { ArticleMiddleware } from "../middleware/articleValidation";

const route = Router();

route.post(
  "/create",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(ArticleMiddleware.createArticle),
  asyncHandler(articleController.createArticle)
);

route.post("/one/:id", asyncHandler(articleController.getOneArticle));

route.post("/all", asyncHandler(articleController.getAllArticles));

route.get(
  "/user/all",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(articleController.getUserAllArticles)
);

route.patch(
  "/one/:id/update",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(ArticleMiddleware.updateArticle),
  asyncHandler(articleController.updateArticle)
);

route.patch(
  "/one/:id/publish",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(ArticleMiddleware.emptyBody),
  asyncHandler(articleController.publishArticle)
);

route.patch(
  "/one/:id/unpublish",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(ArticleMiddleware.emptyBody),
  asyncHandler(articleController.unPublishArticle)
);

route.delete(
  "/one/:id/delete",
  asyncHandler(Authorization.isAuthenticated),
  asyncHandler(ArticleMiddleware.emptyBody),
  asyncHandler(articleController.publishArticle)
);

export default route;
