// tests/ticket.test.ts

import request from "supertest";
import app from "../src/index";
import Ticket from "../src/models/ticket";
import Event from "../src/models/event";
import User, { UserRole } from "../src/models/user";
import sequelize from "../src/config/database";
import Location from "../src/models/location";

describe("Ticket API", () => {
  let ticket: any;
  let admin: any;
  let event: any;
  let location: any;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Criar um admin
    admin = await User.create({
      name: "Admin Teste",
      email: "admin@teste.com",
      password: "admin123",
      role: UserRole.ADMIN,
    });

    // Criar uma localização
    location = await Location.create({
      name: "Localização Teste",
      address: "Endereço de Teste, 123",
      capacity: 50,
    });

    // Criar um evento
    event = await Event.create({
      title: "Test Event",
      description: "This is a test event",
      date: "2025-03-20",
      time: "10:00:00",
      category: "Music",
      organizerId: admin.id,
      locationId: location.id,
    });

    // Criar um ingresso fictício
    ticket = await Ticket.create({
      type: "VIP",
      price: 100,
      quantityAvailable: 50,
      eventId: event.id,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // Teste para criação de ingresso
  test("POST /tickets - deve criar um novo ingresso com dados válidos", async () => {
    const ticketData = {
      type: "Regular",
      price: 50,
      quantityAvailable: 100,
      eventId: event.id,
    };

    const res = await request(app).post("/tickets").send(ticketData);

    expect(res.status).toBe(201); // Verifica se o status da resposta é 201 (Criado)
    expect(res.body).toHaveProperty("id"); // Verifica se o ID do ingresso foi retornado
    expect(res.body.type).toBe("Regular"); // Verifica se o tipo do ingresso está correto
  });

  // Teste para tentar criar ingresso com dados inválidos
  test("POST /tickets - deve retornar erro para dados inválidos", async () => {
    const ticketData = {
      price: 50, // Falta o tipo e quantidade
    };

    const res = await request(app).post("/tickets").send(ticketData);

    expect(res.status).toBe(400); // Verifica se o status é 400
    expect(res.body.error).toBe("Todos os campos obrigatórios devem ser preenchidos."); // Verifica se a mensagem de erro está correta
  });

  // Teste para obter lista de ingressos
  test("GET /tickets - deve retornar uma lista de ingressos", async () => {
    const res = await request(app).get("/tickets");

    expect(res.status).toBe(200); // Verifica se o status da resposta é 200
    expect(Array.isArray(res.body)).toBe(true); // Verifica se a resposta é um array
  });

  // Teste para obter um ingresso específico
  test("GET /tickets/:id - deve retornar os detalhes de um ingresso existente", async () => {
    const res = await request(app).get(`/tickets/${ticket.id}`);

    expect(res.status).toBe(200); // Verifica se o status da resposta é 200
    expect(res.body).toHaveProperty("id"); // Verifica se o ingresso foi encontrado
    expect(res.body.type).toBe("VIP"); // Verifica se o tipo do ingresso está correto
  });

  // Teste para tentar obter um ingresso inexistente
  test("GET /tickets/:id - deve retornar 404 para ingresso não existente", async () => {
    const res = await request(app).get("/tickets/9999"); // ID inexistente

    expect(res.status).toBe(404); // Verifica se o status é 404
    expect(res.body.error).toBe("Ingresso não encontrado."); // Verifica se a mensagem de erro está correta
  });

  // Teste para atualizar os dados de um ingresso
  test("PUT /tickets/:id - deve atualizar os dados de um ingresso existente", async () => {
    const ticketData = { price: 120 }; // Atualizando preço

    const res = await request(app)
      .put(`/tickets/${ticket.id}`)
      .send(ticketData);

    expect(res.status).toBe(200); // Verifica se o status é 200
    expect(res.body.price).toBe(120); // Verifica se o preço foi atualizado
  });

  // Teste para tentar atualizar um ingresso inexistente
  test("PUT /tickets/:id - deve retornar 404 ao tentar atualizar ingresso inexistente", async () => {
    const ticketData = { price: 120 };

    const res = await request(app)
      .put("/tickets/9999") // ID inexistente
      .send(ticketData);

    expect(res.status).toBe(404); // Verifica se o status é 404
    expect(res.body.error).toBe("Ingresso não encontrado."); // Verifica a mensagem de erro
  });

  // Teste para excluir um ingresso
  test("DELETE /tickets/:id - deve excluir um ingresso existente", async () => {
    const res = await request(app).delete(`/tickets/${ticket.id}`);

    expect(res.status).toBe(200); // Verifica se o status é 200
    expect(res.body.message).toBe("Ingresso removido com sucesso."); // Verifica a mensagem de sucesso
  });

  // Teste para tentar excluir um ingresso inexistente
  test("DELETE /tickets/:id - deve retornar 404 ao tentar excluir ingresso inexistente", async () => {
    const res = await request(app).delete("/tickets/9999"); // ID inexistente

    expect(res.status).toBe(404); // Verifica se o status é 404
    expect(res.body.error).toBe("Ingresso não encontrado."); // Verifica a mensagem de erro
  });
});
