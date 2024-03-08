import { Request, Response } from "express";
import { article } from "../models/articleModel";
import { CREATED, OK, NOT_FOUND, NO_CONTENT, BAD_REQUEST } from "http-status";
import { JsonResponse } from "../util/jsonResponse";
import env from "../util/envValidate";
import { createArticleSchema } from "../middleware/articleValidation";

interface AuthRequest extends Request {
  user: any;
}
class Controller {
  async createArticle(req: AuthRequest, res: Response) {
    const { userId } = req.user;
    const { value, error } = createArticleSchema.validate(req.body);
    if (error) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: error.details.map((err) => err.message),
      });
    }
    const newArticle = await article.create({
      ...value,
      author: userId,
      coverImage: `${env.APP_URL}/${req.file?.path}`,
    });

    return JsonResponse(res, {
      status: CREATED,
      newArticle,
      message: "Article created successfully",
    });
  }

  async getUserAllArticles(req: AuthRequest, res: Response) {
    const { userId } = req.user;
    const { status } = req.query;
    let conditions: any = { author: userId };
    if (status === "published") {
      conditions = { ...conditions, is_published: true };
    } else if (status === "unpublished") {
      conditions = { ...conditions, is_published: false };
    }

    const articles = await article.find(conditions);

    if (articles.length === 0) {
      return JsonResponse(res, {
        status: NOT_FOUND,
        message: "There're no articles currently",
      });
    }

    return JsonResponse(res, {
      status: OK,
      articles,
      message: "Successfully fetched articles",
    });
  }

  async getAllArticles(req: AuthRequest, res: Response) {
    const articles = await article.find({ is_published: true });

    return JsonResponse(res, {
      status: OK,
      articles,
      message: "Articles fetched successfully",
    });
  }

  async getOneArticle(req: Request, res: Response) {
    const { id } = req.params;
    const fetchedArticle = await article.findById(id);

    return JsonResponse(res, {
      status: OK,
      article: fetchedArticle,
      message: "Article fetched successfully",
    });
  }

  async updateArticle(req: AuthRequest, res: Response) {
    const { userId } = req.user;
    const { id } = req.params;
    await article.findOneAndUpdate(
      { author: userId, _id: id },
      { ...req.body }
    );

    return JsonResponse(res, {
      status: OK,
      message: "Article updated successfully",
    });
  }

  async publishArticle(req: AuthRequest, res: Response) {
    const { userId } = req.user;
    const { id } = req.params;
    await article.findOneAndUpdate(
      { author: userId, _id: id },
      { is_published: true }
    );

    return JsonResponse(res, {
      status: OK,
      message: "Article Published successfully",
    });
  }

  async unPublishArticle(req: AuthRequest, res: Response) {
    const { userId } = req.user;
    const { id } = req.params;
    await article.findOneAndUpdate(
      { author: userId, _id: id },
      { is_published: false }
    );

    return JsonResponse(res, {
      status: OK,
      message: "Article unpublished successfully",
    });
  }

  async deleteArticle(req: AuthRequest, res: Response) {
    const { userId } = req.user;
    const { id } = req.params;
    await article.findOneAndDelete({
      author: userId,
      _id: id,
      is_published: false,
    });

    return JsonResponse(res, { status: NO_CONTENT });
  }
}

export const articleController = new Controller();
