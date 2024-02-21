import { Request, Response } from "express";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user } from "../models/userModel";
import env from "../util/envValidate";
import { JsonResponse } from "../util/jsonResponse";

class Controller {
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    let hashedPassword = await bcrypt.hash(password, 10);
    const users = await user.find({});
    if (users.length === 0) {
      await user.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        is_verified: true,
      });
      return JsonResponse(res, {
        status: CREATED,
        message: "Admin created Successfully",
      });
    }
    const userExisted = await user.findOne({ email });

    if (userExisted)
      return JsonResponse(res, {
        status: BAD_REQUEST,
        message: "email already taken",
      });

    await user.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      is_verified: true,
    });

    return JsonResponse(res, {
      status: CREATED,
      message: "User created Successfully",
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userExists = await user.findOne({ email });
    if (!userExists)
      return JsonResponse(res, {
        status: UNAUTHORIZED,
        message: "User doesn't exists",
      });

    const valid_pass = await bcrypt.compare(password, userExists.password);
    if (!valid_pass)
      return JsonResponse(res, {
        status: UNAUTHORIZED,
        message: "Password doesn't match",
      });

    const token = jwt.sign(
      { userId: userExists.id, role: userExists.role },
      env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return JsonResponse(res, {
      status: OK,
      message: "Successfully logged in",
      user: userExists,
      token,
    });
  }
}

export const userController = new Controller();
