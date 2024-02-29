import { Request, Response } from "express";
import { CommentModel } from "../models/comments";
import { article } from "../models/articleModel";
import { CREATED, OK, NOT_FOUND, BAD_REQUEST, FORBIDDEN } from "http-status";
import { AuthRequest } from "../types";
import { JsonResponse } from "../util/jsonResponse";

class Controller {
  async comment(req: AuthRequest, res: Response) {
    const { articleId } = req.params;
    const { userId } = req.user;
    const articleExists = await article.findById(articleId);

    if (!articleExists) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Article doesn't exists" });
    }

    if (!articleExists.is_published) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        message: "Article not receiving comments",
      });
    }

    await CommentModel.create({
      article: articleId,
      comment: req.body.comment,
      user: userId,
    });

    return JsonResponse(res, {
      status: CREATED,
      message: "Commented successfully",
    });
  }

  async updateComment(req: AuthRequest, res: Response) {
    const { commentId } = req.params;
    const { userId } = req.user;
    const commentExists = await CommentModel.findOne({
      _id: commentId,
      user: userId,
    });

    if (!commentExists) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Comment doesn't belongs to you!" });
    }

    await CommentModel.findOneAndUpdate(
      { _id: commentId, user: userId },
      {
        comment: req.body.comment,
      }
    );

    return res.status(OK).json({ message: "Updated Comment successfully" });
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

    return res
      .status(OK)
      .json({ message: "Comments fetched successfully", comments });
  }

  async deleteArticleComments(req: AuthRequest, res: Response) {
    const { articleId, commentId } = req.params;
    const { userId } = req.user;
    const articleExists = await article.findById(articleId);

    if (!articleExists) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Article doesn't exists" });
    }

    if (articleExists.author.toString() !== userId) {
      return res.status(FORBIDDEN).json({ message: "Permission denied" });
    }

    await CommentModel.findByIdAndUpdate(commentId, { is_hide: true });

    return res.status(OK).json({ message: "Commented deleted successfully" });
  }

  // async deleteComment(req: Request, res: Response) {
  //   const { commentId } = req.params;
  //   const commentExists = await CommentModel.findById(commentId);

  //   if (!commentExists) {
  //     return res
  //       .status(BAD_REQUEST)
  //       .json({ message: "Comment doesn't exists" });
  //   }

  //   await CommentModel.findByIdAndDelete(commentId);

  //   return res.status(OK).json({ message: "Comment deleted successfully" });
  // }
}

export const commentController = new Controller();
