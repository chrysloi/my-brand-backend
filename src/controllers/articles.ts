import { Request, Response } from "express";
import { article } from "../models/articleModel";
import { CREATED, OK, NOT_FOUND } from "http-status";

interface AuthRequest extends Request {
  user: any;
}
class Controller {
  async createArticle(req: any, res: Response) {
    const { userId } = req.user;
    const newArticle = await article.create({ ...req.body, author: userId });

    return res
      .status(CREATED)
      .json({ newArticle, message: "Article created successfully" });
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
      return res
        .status(NOT_FOUND)
        .json({ articles, message: "There're no articles currently" });
    }

    return res
      .status(OK)
      .json({ articles, message: "Articles fetched successfully" });
  }

  async getAllArticles(req: any, res: Response) {
    const articles = await article.find({ is_published: true });

    return res
      .status(OK)
      .json({ articles, message: "Articles fetched successfully" });
  }

  async getOneArticle(req: Request, res: Response) {
    const { id } = req.params;
    const fetchedArticle = await article.findById(id);

    return res.status(OK).json({
      article: fetchedArticle,
      message: "Article fetched successfully",
    });
  }

  async updateArticle(req: any, res: Response) {
    const { userId } = req.user;
    const { id } = req.params;
    await article.findOneAndUpdate(
      { author: userId, _id: id },
      { ...req.body }
    );

    return res
      .status(CREATED)
      .json({ message: "Article updated successfully" });
  }

  async publishArticle(req: any, res: Response) {
    const { userId } = req.user;
    const { id } = req.params;
    await article.findOneAndUpdate(
      { author: userId, _id: id },
      { is_published: true }
    );

    return res
      .status(CREATED)
      .json({ message: "Article published successfully" });
  }

  async unPublishArticle(req: any, res: Response) {
    const { userId } = req.user;
    const { id } = req.params;
    await article.findOneAndUpdate(
      { author: userId, _id: id },
      { is_published: false }
    );

    return res
      .status(CREATED)
      .json({ message: "Article unpublished successfully" });
  }

  async deleteArticle(req: any, res: Response) {
    const { userId } = req.user;
    const { id } = req.params;
    await article.findOneAndDelete({
      author: userId,
      _id: id,
      is_published: false,
    });

    return res
      .status(CREATED)
      .json({ message: "Article deleted successfully" });
  }
}

export const articleController = new Controller();
