import request from "supertest";
import app from "../src/app";
import envValidate from "../src/util/envValidate";
import mongoose from "mongoose";
import { user } from "../src/models/userModel";

const newUser = {
  name: "Eloi Chrysanthe",
  email: "eloi@gmail.com",
  password: "123456",
  role: "admin",
};

afterAll(async () => {
  await user.deleteMany({});
  await mongoose.disconnect();
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
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("User doesn't exists");
    });
  });
});
