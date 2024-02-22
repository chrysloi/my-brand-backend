import "dotenv/config";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes";
import path from "path";
import { JsonResponse } from "./util/jsonResponse";
import { NOT_FOUND, OK } from "http-status";

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_, res: Response) => {
  return JsonResponse(res, { status: OK, message: "Welcome to my server" });
});

app.get("/api-docs", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "docs.html"));
});

app.use("/api", routes);

app.use("/**", (req: Request, res: Response) => {
  return JsonResponse(res, { status: NOT_FOUND, error: "Route not found" });
});

app.use((error: unknown, req: Request, res: Response) => {
  let errorMessage = "An unknown error occurred";
  if (error instanceof Error) errorMessage = error.message;
  return res.status(500).json({ errorMessage });
});

export default app;
