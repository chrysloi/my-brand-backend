import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { user as userModel } from "../src/models/userModel";
import { MessageModel } from "../src/models/messages";

let admintoken = "";
let usertoken = "";
beforeAll(async () => {
  const admin = {
    name: "Eloi",
    email: "testadminmessage@example.com",
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
  admintoken = res.body.token;
  usertoken = userres.body.token;
});

afterAll(async () => {
  await MessageModel.deleteMany({});
  await mongoose.disconnect();
});

describe("Message testing", () => {
  let messageId = "";
  it("should send a message", async () => {
    const res = await request(app).post("/api/message/send").send({
      fullName: "Eloi Chrysanthe",
      email: "eloi@chrysanthe.com",
      subject: "Help Needed on a project",
      message: "I need you help on my project.",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("should fail message validation when missing a fiels", async () => {
    const res = await request(app).post("/api/message/send").send({
      fullName: "Eloi Chrysanthe",
      email: "eloi@chrysanthe.com",
      subject: "Help Needed on a project",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail message validation when not fields not fulfilled", async () => {
    const res = await request(app).post("/api/message/send").send({
      fullName: "Eloi Chrysanthe",
      email: "eloi@chrysanthe.com",
      subject: "Help Needed on a project",
      message: "Hi",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should get all messages", async () => {
    const res = await request(app)
      .get("/api/message/all")
      .set("Authorization", `Bearer ${admintoken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("messages");
    messageId = res.body.messages[0]._id;
  });

  it("should get all messages", async () => {
    const res = await request(app)
      .get(`/api/message/one/${messageId}`)
      .set("Authorization", `Bearer ${admintoken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("oneMessage");
  });
});
