import "dotenv/config";
import mongoose from "mongoose";
import env from "./util/envValidate";
import app from "./app";

const { MONGODB_URL, PORT } = env;

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("connected to mongodb");
    app.listen(PORT, () => {
      console.info("you server is running well on port: ", PORT);
    });
  })
  .catch((err: Error) => {
    console.log(err);
  });

export default app;
