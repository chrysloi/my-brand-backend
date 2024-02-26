import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

afterAll(async () => {
  await mongoose.disconnect();
});

describe("App testing", () => {
  let token = "";
  describe("status check", () => {
    it("Should return welcoming message", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("Should return 404 if no api found", async () => {
      const res = await request(app).get("/not_found");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});
