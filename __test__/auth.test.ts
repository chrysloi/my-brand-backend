import request from "supertest";
import app from "../src/app";
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
    it("should create an Admin", async () => {
      await user.deleteMany();
      const res = await request(app).post("/api/auth/register").send({
        name: "Admin",
        email: "admin@email.com",
        password: newUser.password,
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message");
      // expect(res.body.message).toBe("Admin created Successfully");
    });

    it("should create a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message");
    });

    it("should fail to create a user when missing a field", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: newUser.name,
        email: newUser.email,
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
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

    it("should fail when password is wrong", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: newUser.email,
        password: "123457",
      });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
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

    it("should fail to Login the user for invalid format field", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john.com",
        password: newUser.password,
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should fail to Login the user for missing a field", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john.com",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });
});
