import "dotenv/config";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes";
import path from "path";

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_, res: Response) => {
  res.status(200).json({ message: "Welcome to my server" });
});

app.get("/api-docs", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "docs", "docs.html"));
});

app.use("/api", routes);

app.use("/**", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error: unknown, req: Request, res: Response) => {
  let errorMessage = "An unknown error occurred";
  if (error instanceof Error) errorMessage = error.message;
  return res.status(500).json({ errorMessage });
});

export default app;
