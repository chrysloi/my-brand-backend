import { Request, Response } from "express";
import { MessageModel } from "../models/messages";
import { AuthRequest } from "../types";
import { JsonResponse } from "../util/jsonResponse";
import { BAD_REQUEST, CREATED, OK } from "http-status";
import sgMail from "@sendgrid/mail";
import env from "../util/envValidate";

sgMail.setApiKey(env.SENDGRID_API);
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

  async replyMessage(req: Request, res: Response) {
    const { replymessage } = req.body;
    const { id } = req.params;
    const message = await MessageModel.findById(id);
    if (!message) {
      return JsonResponse(res, {
        status: BAD_REQUEST,
        error: "this message doesn't exits!",
      });
    }

    await sgMail.send({
      to: message.email,
      from: env.SEND_EMAIL,
      subject: message.subject,
      text: replymessage,
    });
    return JsonResponse(res, {
      status: OK,
      message: "Message Sent successfully",
    });
  }
}

export const MessageController = new Controller();
