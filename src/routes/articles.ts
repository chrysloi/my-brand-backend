import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { articleController } from "../controllers/articles";
import { isAuthenticated, isAdmin } from "../middleware/auth";

const route = Router();

route.post(
  "/create",
  asyncHandler(isAuthenticated),
  asyncHandler(articleController.createArticle)
);

route.post("/one/:id", asyncHandler(articleController.getOneArticle));

route.post("/all", asyncHandler(articleController.getAllArticles));

route.post(
  "/user/all",
  asyncHandler(isAuthenticated),
  asyncHandler(articleController.getUserAllArticles)
);

route.patch(
  "/one/:id/update",
  asyncHandler(isAuthenticated),
  asyncHandler(articleController.updateArticle)
);

route.patch(
  "/one/:id/publish",
  asyncHandler(isAuthenticated),
  asyncHandler(articleController.publishArticle)
);

route.patch(
  "/one/:id/unpublish",
  asyncHandler(isAuthenticated),
  asyncHandler(articleController.unPublishArticle)
);

route.delete(
  "/one/:id/delete",
  asyncHandler(isAuthenticated),
  asyncHandler(articleController.publishArticle)
);

export default route;
