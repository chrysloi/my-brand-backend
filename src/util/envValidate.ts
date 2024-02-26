import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  PORT: port(),
  MONGODB_URL: str(),
  MONGODB_TEST_URL: str(),
  JWT_SECRET: str(),
});
