import { Request } from "express";
import { Project, project } from "./models/projectModel";

export interface AuthRequest extends Request {
  user: any;
}

export interface ProjectRequest extends AuthRequest {
  project: any;
}
