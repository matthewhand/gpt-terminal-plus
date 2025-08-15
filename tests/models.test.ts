import express from "express";
import request from "supertest";
import { setupApiRouter } from "../src/routes/index";
import { getOrGenerateApiToken } from "../src/common/apiToken";

describe("Model Routes", () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  it("should list supported models and current selection", async () => {
    const res = await request(app)
      .get("/model")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.supported)).toBe(true);
    expect(res.body.supported).toContain("gpt-oss:20b");
    expect(typeof res.body.selected).toBe("string");
  });

  it("should set and get selected model", async () => {
    const selectRes = await request(app)
      .post("/model/select")
      .send({ model: "gpt-oss:20b" })
      .set("Authorization", `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(selectRes.status).toBe(200);
    expect(selectRes.body.selected).toBe("gpt-oss:20b");

    const currentRes = await request(app)
      .get("/model/selected")
      .set("Authorization", `Bearer ${token}`);

    expect(currentRes.status).toBe(200);
    expect(currentRes.body.selected).toBe("gpt-oss:20b");
  });

  it("should reject unsupported model selection", async () => {
    const res = await request(app)
      .post("/model/select")
      .send({ model: "not-a-real-model" })
      .set("Authorization", `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Unsupported model/);
  });
});

