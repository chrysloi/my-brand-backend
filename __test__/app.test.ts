import request from "supertest";
import app from "../src/app";

describe("entry file", () => {
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
