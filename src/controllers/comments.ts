import { Request, Response } from "express";
import { CommentModel } from "../models/comments";
import { article } from "../models/articleModel";
import { CREATED, OK, NOT_FOUND, BAD_REQUEST } from "http-status";

class Controller {
  async comment(req: Request, res: Response) {
    const { articleId } = req.params;
    const articleExists = await article.findById(articleId);

    if (!articleExists) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Article doesn't exists" });
    }

    if (!articleExists.is_published) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Article not receiving comments" });
    }

    await CommentModel.create({
      article: articleId,
      comment: req.body.comment,
    });

    return res.status(CREATED).json({ message: "Commented successfully" });
  }

  async updateComment(req: Request, res: Response) {
    const { commentId } = req.params;
    const commentExists = await CommentModel.findById(commentId);

    if (!commentExists) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Article doesn't exists" });
    }

    await CommentModel.findByIdAndUpdate(commentId, {
      comment: req.body.comment,
    });

    return res.status(CREATED).json({ message: "Commented successfully" });
  }

  async getArticleComments(req: Request, res: Response) {
    const { articleId } = req.params;
    const articleExists = await article.findById(articleId);

    if (!articleExists) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Article doesn't exists" });
    }

    const comments = await CommentModel.find({
      article: articleId,
      is_hide: false,
    });

    return res.status(OK).json({ message: "Commented successfully", comments });
  }

  async deleteArticleComments(req: Request, res: Response) {
    const { articleId } = req.params;
    const articleExists = await article.findById(articleId);

    if (!articleExists) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Article doesn't exists" });
    }

    const comments = await CommentModel.find({
      article: articleId,
      is_hide: false,
    });

    return res.status(OK).json({ message: "Commented successfully", comments });
  }

  async deleteComment(req: Request, res: Response) {
    const { commentId } = req.params;
    const commentExists = await CommentModel.findById(commentId);

    if (!commentExists) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Comment doesn't exists" });
    }

    await CommentModel.findByIdAndDelete(commentId);

    return res.status(OK).json({ message: "Comment deleted successfully" });
  }
}

export const commentController = new Controller();
