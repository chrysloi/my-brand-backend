import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import { project } from "../src/models/projectModel";
import { user as userModel } from "../src/models/userModel";
import bcrypt from "bcrypt";
import { FORBIDDEN, NOT_FOUND, NO_CONTENT, UNAUTHORIZED } from "http-status";

let token = "";
let usertoken = "";
const invalidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.N4y6LTQXz0G0dK9FKoDq2u4eiqB0hQ-n9jmbuRZnJow";
beforeAll(async () => {
  const admin = {
    name: "Eloi",
    email: "testadmin@example.com",
    password: "123456",
  };
  const user = {
    name: "Eloi",
    email: "testuser@example.com",
    password: "123456",
  };
  await userModel.insertMany([
    {
      name: admin.name,
      email: admin.email,
      password: await bcrypt.hash(admin.password, 10),
      role: "admin",
      is_verified: true,
    },
    {
      name: user.name,
      email: user.email,
      password: await bcrypt.hash(user.password, 10),
      role: "user",
      is_verified: true,
    },
  ]);
  const res = await request(app).post("/api/auth/login").send({
    email: admin.email,
    password: admin.password,
  });
  const userres = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });
  token = res.body.token;
  usertoken = userres.body.token;
});

afterAll(async () => {
  await project.deleteMany({});
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

  it("should fail to create a new project when not admin", async () => {
    const res = await request(app)
      .post("/api/project/create")
      .send({
        title: "Creating tests",
        detailed: "Some details on Personal project",
      })
      .set("Authorization", `Bearer ${usertoken}`);
    expect(res.status).toBe(FORBIDDEN);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to create a new project when parsed invalid token", async () => {
    const res = await request(app)
      .post("/api/project/create")
      .send({
        title: "Creating tests",
        detailed: "Some details on Personal project",
      })
      .set("Authorization", `${usertoken}`);
    expect(res.status).toBe(UNAUTHORIZED);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to create a new project when parsed invalid token", async () => {
    const res = await request(app)
      .post("/api/project/create")
      .send({
        title: "Creating tests",
        detailed: "Some details on Personal project",
      })
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(res.status).toBe(UNAUTHORIZED);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to create a new project when no token parsed", async () => {
    const res = await request(app).post("/api/project/create").send({
      title: "Creating tests",
      detailed: "Some details on Personal project",
    });
    expect(res.status).toBe(UNAUTHORIZED);
    expect(res.body).toHaveProperty("message");
  });

  it("should update a project", async () => {
    const res = await request(app)
      .patch(`/api/project/one/${projectId}/update`)
      .send({ title: "Updated title" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail to update when project doesn't exists", async () => {
    const res = await request(app)
      .patch(`/api/project/one/65d4e09ae5c2102dd68208f9/update`)
      .send({ title: "Updated title" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(NOT_FOUND);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail to update when validation error", async () => {
    const res = await request(app)
      .patch(`/api/project/one/${projectId}/update`)
      .send({ detailed: "Updated" })
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
    expect(res.status).toBe(NOT_FOUND);
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

  // it("should delete a project", async () => {
  //   const res = await request(app)
  //     .delete(`/api/project/one/${projectId}/delete`)
  //     .set("Authorization", `Bearer ${token}`);
  //   console.info(res.body);
  //   expect(res.status).toBe(NO_CONTENT);
  // });

  // it("should fail to delete a project when project doesn't exists", async () => {
  //   const res = await request(app)
  //     .delete(`/api/project/one/65d4e09ae5c2102dd68208f9/delete`)
  //     .set("Authorization", `Bearer ${token}`);
  //   console.info(res.body);
  //   expect(res.status).toBe(NO_CONTENT);
  // });

  it("should fail to get loggedin user's projects if they're empty", async () => {
    await project.deleteMany({});
    const res = await request(app)
      .get(`/api/project/user/all`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
