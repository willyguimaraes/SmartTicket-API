import request from "supertest";
import app from "../src/index";
import Ticket from "../src/models/ticket";
import  User, { UserRole }  from "../src/models/user";
import Location from "../src/models/location"; 
import Event from "../src/models/event"; 
import sequelize from "../src/config/database";

describe("Reservation API", () => {
  let ticket: any;
  let user: any;
  let admin: any;
  let location: any;
  let event: any;

  beforeAll(async () => {
    
    await sequelize.sync({ force: true });

    // Criar um admin
     admin = await User.create({
      name: "Organizador Teste",
      email: "organizador@teste.com",
      password: "",
      role: UserRole.ADMIN,
    });

    // Criar uma localização
     location = await Location.create({
      name: "Localização Teste",
      address: "Endereço de Teste, 123",
      capacity: 50,
    });

    //criar um evento
     event = await Event.create({
      title: "Test Event",
      description: "This is a test event",
      date: "2025-03-20",
      time: "10:00:00",
      category: "Music",
      organizerId: admin.id,
      locationId: location.id,
    });


    // Criando um ticket fictício
     ticket = await Ticket.create({
      type: "VIP",
      price: 100,
      quantityAvailable: 50,
      eventId: 1,
    });

    // Criando um usuário fictício
     user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: UserRole.CLIENT
    });
  });

  afterAll(async () => {
    
    await sequelize.close();
  });

  test("POST /reservations - deve criar uma nova reserva com dados válidos", async () => {
    const reservationData = {
      quantity: 2,
      userId: user.id,
      eventId: event.id,
      ticketId: ticket.id,
    };

    const res = await request(app).post("/reservations").send(reservationData);

    expect(res.status).toBe(201); // Verifica se o status da resposta é 201 (Criado)
    expect(res.body).toHaveProperty("id"); // Verifica se o ID da reserva foi retornado
    expect(res.body.quantity).toBe(2); // Verifica se a quantidade é a correta
  });

  test("POST /reservations - deve retornar 404 se o ticket não for encontrado", async () => {
    const reservationData = {
      quantity: 2,
      userId: user.id,
      eventId: event.id,
      ticketId: 9999, // ID do ticket inexistente
    };

    const res = await request(app).post("/reservations").send(reservationData);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Ingressos não encontrados.");
  });

  test("POST /reservations - deve retornar 400 se a quantidade for maior que a disponível", async () => {
    const reservationData = {
      quantity: 100, // Quantidade maior que a disponível
      userId: user.id,
      eventId: event.id,
      ticketId: ticket.id,
    };

    const res = await request(app).post("/reservations").send(reservationData);

    expect(res.status).toBe(400); // Verifica se retorna erro 400
    expect(res.body.error).toBe("Quantidade de ingressos indisponível.");
  });

  test("GET /reservations/:id - deve retornar os detalhes de uma reserva existente", async () => {
    const reservation = await request(app).post("/reservations").send({
      quantity: 2,
      userId: user.id,
      eventId: event.id,
      ticketId: ticket.id,
    });

    const res = await request(app).get(`/reservations/${reservation.body.id}`);

    expect(res.status).toBe(200); // Verifica se a reserva foi encontrada
    expect(res.body).toHaveProperty("id");
  });

  test("DELETE /reservations/:id - deve cancelar uma reserva existente com sucesso", async () => {
    const reservation = await request(app).post("/reservations").send({
      quantity: 2,
      userId: user.id,
      eventId: event.id,
      ticketId: ticket.id,
    });

    const res = await request(app).delete(`/reservations/${reservation.body.id}`);

    expect(res.status).toBe(200); // Verifica se a reserva foi cancelada com sucesso
    expect(res.body.message).toBe("Reserva cancelada com sucesso.");
  });
});
