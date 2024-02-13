import { NextFunction, Request, Response } from "express";
import { FORBIDDEN, UNAUTHORIZED } from "http-status";
import env from "../util/envValidate";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization") || req.header("token");

  if (!authHeader) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Unauthorized: Missing invalid token." });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).json({ message: "Invalid token format." });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, env.JWT_SECRET, (error: any, user: any) => {
    if (error) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Invalid token format.", error });
    }
    req.user = user;
    next();
  });
};

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return res.status(FORBIDDEN).json({
      message: "Forbidden: You are not authorized to access this route.",
    });
  }
  next();
};
