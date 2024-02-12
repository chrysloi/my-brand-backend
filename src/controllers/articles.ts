import { Request, Response } from "express";

class Controller {
  async createArticle(req: Request, res: Response) {}
}

export const articleController = new Controller();
