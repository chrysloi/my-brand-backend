import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import { article } from "../src/models/articleModel";
import { user as userModel } from "../src/models/userModel";
import bcrypt from "bcrypt";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

const user = {
  name: "Eloi",
  email: "testuser@example.com",
  password: "123456",
};
let token = "";
let blogId = "";
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
  const articleres = await request(app)
    .post("/api/blog/create")
    .send({
      title: "Creating tests",
      detailed: "Some details on creating tests",
      summary: "Some details on creating tests",
    })
    .set("Authorization", `Bearer ${res.body.token}`);
  token = res.body.token;
  blogId = articleres.body.newArticle._id;
});

afterAll(async () => {
  await article.deleteMany({});
  await mongoose.disconnect();
});

describe("Blog testing", () => {
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
    // blogId = res.body.newArticle._id;
  });

  it("should return error when creating a new article and missing a field", async () => {
    const res = await request(app)
      .post("/api/blog/create")
      .send({
        title: "Creating tests",
        detailed: "Some details on creating tests",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
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

  it("should fail to publish an article when parsed in a body", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/${blogId}/publish`)
      .send({ isPublished: true })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail to publish an article when not existed", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/65d4e09ae5c2102dd68208f9/publish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(NOT_FOUND);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Article Doesn't exists or you're not the owner"
    );
  });

  it("should unpublish an article", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/${blogId}/unpublish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to unpublish an article when parsed in a body", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/${blogId}/unpublish`)
      .send({ isPublished: false })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(BAD_REQUEST);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail to unpublish an article when not existed", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/65d4e09ae5c2102dd68208f9/unpublish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(NOT_FOUND);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Article Doesn't exists or you're not the owner"
    );
  });

  it("should get published articles", async () => {
    const res = await request(app).get(`/api/blog/all`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Articles fetched successfully");
  });

  it("should update an article", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/${blogId}/update`)
      .send({ title: "Updated title" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to update when article doesn't exists", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/65d4e09ae5c2102dd68208f9/update`)
      .send({ title: "Updated title" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(NOT_FOUND);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to update when validation error", async () => {
    const res = await request(app)
      .patch(`/api/blog/one/${blogId}/update`)
      .send({ detailed: "Updated" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail to get loggedin user's articles if they're empty", async () => {
    await article.deleteMany({});
    const res = await request(app)
      .get(`/api/blog/user/all`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
