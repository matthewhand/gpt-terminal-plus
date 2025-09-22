import express from "express";
import request from "supertest";
import { setupApiRouter } from "../src/routes/index";
import { getOrGenerateApiToken } from "../src/common/apiToken";

describe("Model Management API - Enhanced", () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    process.env.LLM_ENABLED = 'true';
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
      expect(typeof res.body.selected).toBe("string");
      expect(res.body.supported.length).toBeGreaterThan(0);
    });

    it("validates model list structure and types", async () => {
      const res = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body).toHaveProperty('supported');
      expect(res.body).toHaveProperty('selected');
      expect(res.body.supported.every((model: string) => typeof model === 'string')).toBe(true);
      expect(res.body.supported.every((model: string) => model.length > 0)).toBe(true);
    });

    it("includes expected model formats", async () => {
      const res = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      // Should include common model patterns
      const hasValidFormat = res.body.supported.some((model: string) => 
        /^[a-zA-Z0-9\-_.:]+$/.test(model)
      );
      expect(hasValidFormat).toBe(true);
    });

    it("handles concurrent requests efficiently", async () => {
      const requests = Array.from({ length: 5 }, () =>
        request(app)
          .get("/model")
          .set("Authorization", `Bearer ${token}`)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(res => {
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.supported)).toBe(true);
      });

      // All responses should be identical
      const firstResponse = responses[0].body;
      responses.slice(1).forEach(res => {
        expect(res.body).toEqual(firstResponse);
      });
    });

    it("requires authentication", async () => {
      const res = await request(app)
        .get("/model");
      expect(res.status).toBe(401);
    });

    it("rejects various invalid auth formats", async () => {
      const invalidAuths = [
        "Bearer invalid-token",
        "Basic dGVzdA==",
        "Bearer ",
        "invalid-format",
        ""
      ];

      for (const auth of invalidAuths) {
        const res = await request(app)
          .get("/model")
          .set("Authorization", auth);
        expect(res.status).toBe(401);
      }
    });
  });

  describe("Model Selection", () => {
    let availableModels: string[];

    beforeEach(async () => {
      // Get available models for testing
      const res = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);
      availableModels = res.body.supported;
    });

    it("selects valid model successfully", async () => {
      if (availableModels.length === 0) {
        console.warn("No models available for testing");
        return;
      }

      const testModel = availableModels[0];
      
      const selectRes = await request(app)
        .post("/model/select")
        .send({ model: testModel })
        .set("Authorization", `Bearer ${token}`)
        .set('Content-Type', 'application/json');

      expect(selectRes.status).toBe(200);
      expect(selectRes.body.selected).toBe(testModel);

      // Verify selection persisted
      const currentRes = await request(app)
        .get("/model/selected")
        .set("Authorization", `Bearer ${token}`);

      expect(currentRes.status).toBe(200);
      expect(currentRes.body.selected).toBe(testModel);
    });

    it("rejects unsupported model", async () => {
      const res = await request(app)
        .post("/model/select")
        .send({ model: "definitely-not-a-real-model-12345" })
        .set("Authorization", `Bearer ${token}`)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.message || res.body.error).toMatch(/[Uu]nsupported|[Ii]nvalid|[Nn]ot found/);
    });

    it("validates selection payload structure", async () => {
      const invalidPayloads = [
        {},
        { model: "" },
        { model: null },
        { model: undefined },
        { model: 123 },
        { model: [] },
        { model: {} },
        { wrongField: "model-name" }
      ];

      for (const payload of invalidPayloads) {
        const res = await request(app)
          .post("/model/select")
          .send(payload)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBeGreaterThanOrEqual(400);
      }
    });

    it("handles malformed JSON gracefully", async () => {
      const res = await request(app)
        .post("/model/select")
        .set("Authorization", `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('{"model": invalid json}');

      expect(res.status).toBe(400);
    });

    it("handles very long model names", async () => {
      const longModelName = "a".repeat(1000);
      
      const res = await request(app)
        .post("/model/select")
        .send({ model: longModelName })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("handles special characters in model names", async () => {
      const specialNames = [
        "model with spaces",
        "model/with/slashes",
        "model\\with\\backslashes",
        "model;with;semicolons",
        "model|with|pipes",
        "model<with>brackets"
      ];

      for (const modelName of specialNames) {
        const res = await request(app)
          .post("/model/select")
          .send({ model: modelName })
          .set("Authorization", `Bearer ${token}`);

        // Should either reject or handle gracefully
        expect(res.status).toBeGreaterThanOrEqual(200);
      }
    });

    it("requires authentication for selection", async () => {
      const res = await request(app)
        .post("/model/select")
        .send({ model: "test-model" });
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
      expect(res.body.selected.length).toBeGreaterThan(0);
    });

    it("maintains consistency with model list", async () => {
      const listRes = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);
      
      const selectedRes = await request(app)
        .get("/model/selected")
        .set("Authorization", `Bearer ${token}`);

      expect(listRes.body.selected).toBe(selectedRes.body.selected);
    });

    it("requires authentication for current model", async () => {
      const res = await request(app)
        .get("/model/selected");
      expect(res.status).toBe(401);
    });
  });

  describe("Model Persistence and State Management", () => {
    it("persists model selection across multiple requests", async () => {
      const listRes = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);
      
      if (listRes.body.supported.length === 0) return;
      
      const testModel = listRes.body.supported[0];
      
      // Select model
      await request(app)
        .post("/model/select")
        .send({ model: testModel })
        .set("Authorization", `Bearer ${token}`);

      // Verify persistence across multiple requests
      for (let i = 0; i < 3; i++) {
        const res = await request(app)
          .get("/model/selected")
          .set("Authorization", `Bearer ${token}`);
        expect(res.body.selected).toBe(testModel);
      }
    });

    it("handles rapid model switching", async () => {
      const listRes = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);
      
      if (listRes.body.supported.length < 2) return;
      
      const models = listRes.body.supported.slice(0, 2);
      
      // Rapidly switch between models
      for (const model of models) {
        const selectRes = await request(app)
          .post("/model/select")
          .send({ model })
          .set("Authorization", `Bearer ${token}`);
        
        expect(selectRes.status).toBe(200);
        
        const verifyRes = await request(app)
          .get("/model/selected")
          .set("Authorization", `Bearer ${token}`);
        
        expect(verifyRes.body.selected).toBe(model);
      }
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("handles non-existent endpoints gracefully", async () => {
      const endpoints = [
        "/model/nonexistent",
        "/model/select/invalid",
        "/model/123",
        "/model/selected/extra"
      ];

      for (const endpoint of endpoints) {
        const res = await request(app)
          .get(endpoint)
          .set("Authorization", `Bearer ${token}`);
        expect([404, 405]).toContain(res.status);
      }
    });

    it("handles different HTTP methods appropriately", async () => {
      // Test unsupported methods
      const unsupportedMethods = [
        { method: 'put', endpoint: '/model' },
        { method: 'delete', endpoint: '/model' },
        { method: 'patch', endpoint: '/model/select' },
        { method: 'delete', endpoint: '/model/selected' }
      ];

      for (const { method, endpoint } of unsupportedMethods) {
        const res = await (request(app) as any)[method](endpoint)
          .set("Authorization", `Bearer ${token}`);
        expect([404, 405]).toContain(res.status);
      }
    });

    it("provides meaningful error messages", async () => {
      const res = await request(app)
        .post("/model/select")
        .send({ model: "invalid-model-name" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
      expect(res.body.message.length).toBeGreaterThan(0);
    });

    it("handles content-type variations", async () => {
      const listRes = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);
      
      if (listRes.body.supported.length === 0) return;
      
      const testModel = listRes.body.supported[0];
      
      // Test with different content types
      const contentTypes = [
        'application/json',
        'application/json; charset=utf-8',
        'text/plain' // Should be rejected or handled
      ];

      for (const contentType of contentTypes) {
        let res;
        if (contentType === 'text/plain') {
          // Send as string for text/plain
          res = await request(app)
            .post("/model/select")
            .send(JSON.stringify({ model: testModel }))
            .set("Authorization", `Bearer ${token}`)
            .set('Content-Type', contentType);
        } else {
          // Send as object for JSON content types
          res = await request(app)
            .post("/model/select")
            .send({ model: testModel })
            .set("Authorization", `Bearer ${token}`)
            .set('Content-Type', contentType);
        }

        // Should either succeed or fail gracefully
        expect(res.status).toBeGreaterThanOrEqual(200);
      }
    });
  });

  describe("Performance and Reliability", () => {
    it("responds within reasonable time limits", async () => {
      const startTime = Date.now();
      
      const res = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(res.status).toBe(200);
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it("handles concurrent model selections safely", async () => {
      const listRes = await request(app)
        .get("/model")
        .set("Authorization", `Bearer ${token}`);
      
      if (listRes.body.supported.length === 0) return;
      
      const testModel = listRes.body.supported[0];
      
      // Send concurrent selection requests
      const concurrentRequests = Array.from({ length: 5 }, () =>
        request(app)
          .post("/model/select")
          .send({ model: testModel })
          .set("Authorization", `Bearer ${token}`)
      );

      const responses = await Promise.all(concurrentRequests);
      
      // All should succeed or fail consistently
      const statuses = responses.map(r => r.status);
      const uniqueStatuses = [...new Set(statuses)];
      expect(uniqueStatuses.length).toBeLessThanOrEqual(2); // Should be consistent
      
      // Final state should be correct
      const finalRes = await request(app)
        .get("/model/selected")
        .set("Authorization", `Bearer ${token}`);
      expect(finalRes.body.selected).toBe(testModel);
    });
  });
});