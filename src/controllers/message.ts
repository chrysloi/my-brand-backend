import { Request, Response } from "express";
import { MessageModel } from "../models/messages";
import { AuthRequest } from "../types";
import { JsonResponse } from "../util/jsonResponse";
import { CREATED, OK } from "http-status";

class Controller {
  async sendMessage(req: Request, res: Response) {
    await MessageModel.create({ ...req.body });
    return JsonResponse(res, {
      status: CREATED,
      message: "Message sent successfully",
    });
  }

  async getAllMessages(req: Request, res: Response) {
    const messages = await MessageModel.find({});
    return JsonResponse(res, {
      status: OK,
      messages,
      message: "Message retrieved successfully",
    });
  }

  async readMessage(req: Request, res: Response) {
    const { id } = req.params;
    const oneMessage = await MessageModel.findById(id);
    return JsonResponse(res, {
      status: OK,
      oneMessage,
      message: "Message retrieved successfully",
    });
  }
}

export const MessageController = new Controller();
