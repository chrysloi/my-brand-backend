import "dotenv/config";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes";
import path from "path";
import { JsonResponse } from "./util/jsonResponse";
import { NOT_FOUND, OK } from "http-status";
import mongoose from "mongoose";
import cors from "cors";
import env from "./util/envValidate";

const app: Express = express();
const { isTest, MONGODB_TEST_URL, MONGODB_URL } = env;

app.use(morgan("dev"));
app.use(cors());
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

(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(isTest ? MONGODB_TEST_URL : MONGODB_URL).then(() => {
      console.log("Ready To work with MongoDB");
    });
  } catch (error) {
    console.log(error);
  }
})();

export default app;
