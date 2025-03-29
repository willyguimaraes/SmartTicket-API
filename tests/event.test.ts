// tests/event.test.ts

import request from "supertest";
import app from "../src/index";
import sequelize from "../src/config/database";
import User, { UserRole } from "../src/models/user";
import Location from "../src/models/location";

describe("Event API", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Criar um usuário
    const user = await User.create({
      name: "Organizador Teste",
      email: "organizador@teste.com",
      password: "",
      role: UserRole.ADMIN,
    });

    // Criar uma localização
    const location = await Location.create({
      name: "Localização Teste",
      address: "Endereço de Teste, 123",
      capacity: 0,
    });
  });
  // Suite: POST /events
  describe("POST /events", () => {
    it("deve criar um novo evento com dados válidos", async () => {
      const res = await request(app).post("/events").send({
        title: "Test Event",
        description: "This is a test event",
        date: "2025-03-20",
        time: "10:00:00",
        category: "Music",
        organizerId: 1,
        locationId: 1,
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Test Event");
    });

    it("deve retornar erro para dados inválidos (campos faltantes)", async () => {
      const res = await request(app)
        .post("/events")
        .send({ description: "Missing title" }); // Campos obrigatórios faltando
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  // Suite: GET /events
  describe("GET /events", () => {
    it("deve retornar uma lista de eventos com suporte a paginação", async () => {
      const res = await request(app).get("/events?page=1&limit=5");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // Suite: GET /events/:id
  describe("GET /events/:id", () => {
    it("deve retornar os detalhes de um evento existente", async () => {
      const res = await request(app).get("/events/1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title");
    });

    it("deve retornar 404 para evento não existente", async () => {
      const res = await request(app).get("/events/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  // Suite: PUT /events/:id
  describe("PUT /events/:id", () => {
    it("deve atualizar os dados de um evento existente", async () => {
      const res = await request(app)
        .put("/events/1")
        .send({ title: "Updated Event Title" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", "Updated Event Title");
    });

    it("deve retornar 404 ao tentar atualizar evento inexistente", async () => {
      const res = await request(app)
        .put("/events/9999")
        .send({ title: "Non Existent Event" });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  // Suite: DELETE /events/:id
  describe("DELETE /events/:id", () => {
    it("deve excluir um evento existente", async () => {
      const res = await request(app).delete("/events/1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("deve retornar 404 ao tentar excluir evento inexistente", async () => {
      const res = await request(app).delete("/events/9999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});

// Fecha a conexão com o banco de dados após os testes para evitar handles abertos
afterAll(async () => {
  await sequelize.close();
});
