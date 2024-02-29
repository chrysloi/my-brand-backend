import "dotenv/config";
import mongoose from "mongoose";
import env from "./util/envValidate";
import app from "./app";

app.listen(env.PORT, () => {
  console.info("you server is running well on port: ", env.PORT);
});

export default app;
