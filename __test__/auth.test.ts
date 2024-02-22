import { user } from "../src/models/userModel";
import app from "../src/index";
import request from "supertest";

const newUser = {
  name: "Eloi Chrysanthe",
  email: "eloi@gmail.com",
  password: "123456",
  role: "admin",
};

beforeAll(async () => {
  await user.deleteMany({});
});

describe("Authentication", () => {
  describe("register user", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });
      expect(res.status).toBe(201);
    });

    it("should fail when email was used.", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });
      expect(res.status).toBe(400);
    });
  });

  describe("login", () => {
    it("should Login the registered user", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: newUser.email,
        password: newUser.password,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should fail to Login the user doesn't exists", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: newUser.password,
      });

      expect(res.status).toBe(401);
    });
  });
});
