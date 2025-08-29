import express from "express";
import request from "supertest";
import { setupApiRouter } from "../src/routes/index";
import { getOrGenerateApiToken } from "../src/common/apiToken";

describe("Model Management API", () => {
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

  describe("Model Listing", () => {
    it("lists supported models with metadata", async () => {
      const res = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.supported)).toBe(true);
      expect(res.body.supported).toContain("gpt-oss:20b");
      expect(typeof res.body.selected).toBe("string");
      expect(res.body.supported.length).toBeGreaterThan(0);
    });

    it("validates model list structure", async () => {
      const res = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body).toHaveProperty('supported');
      expect(res.body).toHaveProperty('selected');
      expect(res.body.supported.every((model: string) => typeof model === 'string')).toBe(true);
    });

    it("requires authentication", async () => {
      const res = await request(app)
        .get("/model");
      expect(res.status).toBe(401);
    });

    it("rejects invalid auth token", async () => {
      const res = await request(app)
        .get("/model")
        .set("Authorization", "Bearer invalid-token");
      expect(res.status).toBe(401);
    });
  });

  describe("Model Selection", () => {
    it("selects valid model successfully", async () => {
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

    it("rejects unsupported model", async () => {
      const res = await request(app)
        .post("/model/select")
        .send({ model: "not-a-real-model" })
        .set("Authorization", `Bearer ${token}`)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Unsupported model/);
    });

    it("validates selection payload", async () => {
      const res = await request(app)
        .post("/model/select")
        .send({})
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("handles empty model name", async () => {
      const res = await request(app)
        .post("/model/select")
        .send({ model: "" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("requires authentication for selection", async () => {
      const res = await request(app)
        .post("/model/select")
        .send({ model: "gpt-oss:20b" });
      expect(res.status).toBe(401);
    });
  });

  describe("Current Model Retrieval", () => {
    it("returns currently selected model", async () => {
      const res = await request(app)
        .get("/model/selected")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('selected');
      expect(typeof res.body.selected).toBe('string');
    });

    it("requires authentication for current model", async () => {
      const res = await request(app)
        .get("/model/selected");
      expect(res.status).toBe(401);
    });
  });

  describe("Model Persistence", () => {
    it("persists model selection across requests", async () => {
      const testModel = "gpt-oss:20b";
      
      await request(app)
        .post("/model/select")
        .send({ model: testModel })
        .set("Authorization", `Bearer ${token}`);

      const res1 = await request(app)
        .get("/model/selected")
        .set("Authorization", `Bearer ${token}`);
      expect(res1.body.selected).toBe(testModel);

      const res2 = await request(app)
        .get("/model/selected")
        .set("Authorization", `Bearer ${token}`);
      expect(res2.body.selected).toBe(testModel);
    });
  });

  describe("Error Handling", () => {
    it("handles malformed JSON", async () => {
      const res = await request(app)
        .post("/model/select")
        .set("Authorization", `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(res.status).toBe(400);
    });

    it("handles non-string model values", async () => {
      const res = await request(app)
        .post("/model/select")
        .send({ model: 123 })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("returns 404 for non-existent endpoints", async () => {
      const res = await request(app)
        .get("/model/nonexistent")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe("Model Validation", () => {
    it("validates model format", async () => {
      const invalidFormats = ['', ' ', 'model with spaces', 'model/with/slashes'];
      
      for (const invalidModel of invalidFormats) {
        const res = await request(app)
          .post("/model/select")
          .send({ model: invalidModel })
          .set("Authorization", `Bearer ${token}`);
        expect([400, 422]).toContain(res.status);
      }
    });

    it("accepts valid model formats", async () => {
      const validModels = ['gpt-oss:20b', 'llama2:7b', 'claude-3'];
      
      for (const validModel of validModels) {
        const res = await request(app)
          .post("/model/select")
          .send({ model: validModel })
          .set("Authorization", `Bearer ${token}`);
        
        if (res.body.supported && res.body.supported.includes(validModel)) {
          expect(res.status).toBe(200);
        } else {
          expect(res.status).toBe(400); // Unsupported but valid format
        }
      }
    });
  });
});

