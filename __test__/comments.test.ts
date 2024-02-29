import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { user as userModel } from "../src/models/userModel";
import { CommentModel } from "../src/models/comments";
import { article as articleModel } from "../src/models/articleModel";

let token = "";
let articleId = "";
let publishedArticleId = "";
beforeAll(async () => {
  const { _id: userId } = await userModel.create({
    name: "Commentor",
    email: "commentor@test.com",
    password: await bcrypt.hash("123456", 10),
    role: "user",
    is_verified: true,
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "commentor@test.com",
    password: "123456",
  });
  const blogres = await request(app)
    .post("/api/blog/create")
    .send({
      title: "Creating tests",
      detailed: "Some details on creating tests",
      summary: "Some details on creating tests",
    })
    .set("Authorization", `Bearer ${res.body.token}`);
  const { _id } = await articleModel.create({
    title: "Some tests",
    detailed: "Some details",
    summary: "some sumary",
    is_published: true,
    author: userId,
  });
  token = res.body.token;
  articleId = blogres.body.newArticle._id;
  publishedArticleId = _id.toString();
});

afterAll(async () => {
  await CommentModel.deleteMany();
  await mongoose.disconnect();
});

describe("Testing Comments", () => {
  let commentId = "";
  it("should comment on a published article", async () => {
    const res = await request(app)
      .post(`/api/comments/comment/${publishedArticleId}`)
      .send({
        comment: "Creating tests",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to comment when article not published", async () => {
    const res = await request(app)
      .post(`/api/comments/comment/${articleId}`)
      .send({
        comment: "Creating tests",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to comment when article doesn't exists", async () => {
    const res = await request(app)
      .post(`/api/comments/comment/65d4e09ae5c2102dd68208f9`)
      .send({
        comment: "Creating tests",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should get all comments for an article", async () => {
    const res = await request(app).get(
      `/api/comments/article/${publishedArticleId}`
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    commentId = res.body.comments[0]._id;
  });

  it("should fail to get all comments when article doesn't exists", async () => {
    const res = await request(app).get(`/api/comments/article/${commentId}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to update a comment on article when unauthenticated", async () => {
    const res = await request(app)
      .patch(`/api/comments/one/${commentId}`)
      .send({
        comment: "Creating tests",
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to update a comment on article when comment doesn't exist", async () => {
    const res = await request(app)
      .patch(`/api/comments/one/${articleId}`)
      .send({
        comment: "Creating tests",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should update a comment on article", async () => {
    const res = await request(app)
      .patch(`/api/comments/one/${commentId}`)
      .send({
        comment: "Creating tests",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("author should delete a comment on article", async () => {
    const res = await request(app)
      .delete(`/api/comments/article/${publishedArticleId}/${commentId}`)
      .send({
        comment: "Creating tests",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to delete comment when article doesn't exists", async () => {
    const res = await request(app)
      .delete(`/api/comments/article/${commentId}/${commentId}`)
      .send({
        comment: "Creating tests",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});
