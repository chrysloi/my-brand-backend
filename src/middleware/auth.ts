import { NextFunction, Request, Response } from "express";
import { FORBIDDEN, UNAUTHORIZED } from "http-status";
import env from "../util/envValidate";
import jwt from "jsonwebtoken";
import { JsonResponse } from "../util/jsonResponse";
import { AuthRequest } from "../types";

class Authorise {
  async isAuthenticated(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.header("Authorization") || req.header("token");

    if (!authHeader) {
      return JsonResponse(res, {
        status: UNAUTHORIZED,
        message: "Unauthorized: Missing invalid token.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return JsonResponse(res, {
        status: UNAUTHORIZED,
        message: "Invalid token format.",
      });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, env.JWT_SECRET, (error: any, user: any) => {
      if (error) {
        return JsonResponse(res, {
          status: UNAUTHORIZED,
          message: "Invalid token format.",
          error,
        });
      }
      req.user = user;
      next();
    });
  }

  async isAdmin(req: any, res: Response, next: NextFunction) {
    if (req.user.role !== "admin") {
      return JsonResponse(res, {
        status: FORBIDDEN,
        message: "Forbidden: You are not authorized to access this route.",
      });
    }
    next();
  }
}

export const Authorization = new Authorise();
