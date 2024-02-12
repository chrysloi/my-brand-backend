import { Request, Response } from "express";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user } from "../models/userModel";
import env from "../util/envValidate";

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
      return res
        .status(CREATED)
        .json({ message: "Admin created Successfully" });
    }
    const userExisted = await user.findOne({ email });

    if (userExisted)
      return res.status(BAD_REQUEST).json({ message: "email already taken" });

    await user.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      is_verified: true,
    });

    return res.status(CREATED).json({ message: "User created Successfully" });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userExists = await user.findOne({ email });
    if (!userExists)
      return res.status(UNAUTHORIZED).json({ message: "User doesn't exists" });

    const valid_pass = await bcrypt.compare(password, userExists.password);
    if (!valid_pass)
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Password doesn't match" });

    const token = jwt.sign({ userId: userExists.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(OK)
      .json({ user: userExists, token, message: "Successfulll logged in" });
  }
}

export const userController = new Controller();
