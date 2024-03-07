import { Router } from "express";
import userRoutes from "./user";
import articleRoutes from "./articles";
import projectRoutes from "./project";
import commentsRoutes from "./comments";
import messageRoutes from "./message";

const route = Router();

route.use("/auth", userRoutes);
route.use("/blog", articleRoutes);
route.use("/project", projectRoutes);
route.use("/comments", commentsRoutes);
route.use("/message", messageRoutes);

export default route;
