import app from "../src/app";
import request from "supertest";
import bcrypt from "bcrypt";
import { article } from "../src/models/articleModel";
import { user } from "../src/models/userModel";

// const newUser = {
//   name: "John Doe",
//   email: "john.doe@gmail.com",
//   password: "123456",
//   role: "user",
// };
const newUser = {
  name: "Eloi Chrysanthe",
  email: "eloi@gmail.com",
  password: "123456",
  role: "admin",
};
let token = "";

beforeAll(async () => {
  //   await article.deleteMany({});
  //   await user.create({
  //     name: newUser.name,
  //     email: newUser.name,
  //     password: await bcrypt.hash(newUser.password, 10),
  //     role: newUser.role,
  //     is_verified: true,
  //   });

  const resp = await request(app).post("/api/auth/login").send({
    email: newUser.email,
    password: newUser.password,
  });
  token = resp.body.token;
});

describe("Blog", () => {
  describe("Create an article", () => {
    it("should create a new article", async () => {
      const resp = await request(app).post("/api/auth/login").send({
        email: "eloi@gmail.com",
        password: "123456",
      });
      //   token = resp.body.token;
      const res = await request(app)
        .post("/api/blog/create")
        .send({
          title: "Creating tests",
          detailed: "Some details on creating tests",
          summary: "Some details on creating tests",
        })
        .set("Authorization", `Bearer ${resp.body.token}`);
      expect(res.status).toBe(201);
    });
  });
});
