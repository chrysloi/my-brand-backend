import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import { article } from "../src/models/articleModel";
import { user as userModel } from "../src/models/userModel";
import bcrypt from "bcrypt";

const user = {
  name: "Eloi",
  email: "testuser@example.com",
  password: "123456",
};
let token = "";
beforeAll(async () => {
  await userModel.create({
    name: user.name,
    email: user.email,
    password: await bcrypt.hash(user.password, 10),
    role: "user",
    is_verified: true,
  });
  const res = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });
  console.info(res.body);
  token = res.body.token;
});

afterAll(async () => {
  await article.deleteMany({});
  await mongoose.disconnect();
});

describe("Blog testing", () => {
  let blogId = "";
  it("should create a new article", async () => {
    const res = await request(app)
      .post("/api/blog/create")
      .send({
        title: "Creating tests",
        detailed: "Some details on creating tests",
        summary: "Some details on creating tests",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Article created successfully");
    blogId = res.body.newArticle._id;
  });

  it("should get an article", async () => {
    const res = await request(app)
      .get(`/api/blog/one/${blogId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Article fetched successfully");
  });

  it("should publish an article", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/${blogId}/publish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should unpublish an article", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/${blogId}/unpublish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should get published articles", async () => {
    const res = await request(app).get(`/api/blog/all`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Articles fetched successfully");
  });

  it("should fail to get loggedin user's articles if they're empty", async () => {
    const res = await request(app)
      .get(`/api/blog/user/all`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
