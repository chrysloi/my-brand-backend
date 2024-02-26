import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import { article } from "../src/models/articleModel";
import { user as userModel } from "../src/models/userModel";
import bcrypt from "bcrypt";

const user = {
  name: "Eloi",
  email: "testadmin@example.com",
  password: "123456",
};
let token = "";
beforeAll(async () => {
  await userModel.create({
    name: user.name,
    email: user.email,
    password: await bcrypt.hash(user.password, 10),
    role: "admin",
    is_verified: true,
  });
  const res = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });
  token = res.body.token;
});

afterAll(async () => {
  await article.deleteMany({});
  await mongoose.disconnect();
});

describe("Project testing", () => {
  let projectId = "";
  it("should create a new project", async () => {
    const res = await request(app)
      .post("/api/project/create")
      .send({
        title: "Creating tests",
        detailed: "Some details on Personal project",
        summary: "Some details on Personal project",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
    projectId = res.body.newProject._id;
  });

  it("should fail to create a new project when missing a field", async () => {
    const res = await request(app)
      .post("/api/project/create")
      .send({
        title: "Creating tests",
        detailed: "Some details on Personal project",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should get a project", async () => {
    const res = await request(app)
      .get(`/api/project/one/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to get a project when not existing", async () => {
    const res = await request(app)
      .get(`/api/project/one/65d4e09ae5c2102dd68208f9`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  it("should publish a project", async () => {
    const res = await request(app)
      .patch(`/api/project/one/${projectId}/publish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to publish a project when parsed in items in body", async () => {
    const res = await request(app)
      .patch(`/api/project/one/${projectId}/publish`)
      .send({ isPublished: true })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail to publish a project when it's already published", async () => {
    const res = await request(app)
      .patch(`/api/project/one/${projectId}/publish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to publish a project when not existing", async () => {
    const res = await request(app)
      .patch(`/api/project/one/65d4e09ae5c2102dd68208f9/publish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  it("should unpublish a project", async () => {
    const res = await request(app)
      .patch(`/api/project/one/${projectId}/unpublish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to unpublish a project when not existing", async () => {
    const res = await request(app)
      .patch(`/api/project/one/65d4e09ae5c2102dd68208f9/unpublish`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  it("should get published projects", async () => {
    const res = await request(app).get(`/api/project/all`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  // it("should fail to get loggedin user's projects if they're empty", async () => {
  //   const res = await request(app)
  //     .get(`/api/project/user/all`)
  //     .set("Authorization", `Bearer ${token}`);
  //   expect(res.status).toBe(404);
  // });
});
