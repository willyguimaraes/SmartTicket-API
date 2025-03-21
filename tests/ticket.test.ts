import request from 'supertest';
import app from '../src/index';
import sequelize from '../src/config/database';
import Ticket from '../src/models/ticket';
import Event from '../src/models/event';

beforeAll(async () => {
  // Sincroniza os modelos com o banco de dados em memória
  await sequelize.sync({ force: true });

  // Cria um evento antes de criar ingressos
  const event = await Event.create({
    title: 'Evento Teste',
    description: 'Descrição do evento teste',
    date: '2025-05-20',
    time: '18:00',
    category: 'Tecnologia',
    organizerId: 1,
    locationId: 1,
  });

  // Cria um ingresso para o evento criado
  await Ticket.create({
    eventId: event.id,  // Associa o ingresso ao evento criado
    type: 'VIP',
    price: 50.0,
    quantityAvailable: 100,
  });
});

describe('Ticket API', () => {
  describe('POST /tickets', () => {
    it('deve criar um novo ingresso com dados válidos', async () => {
      const event = await Event.create({
        title: 'Novo Evento',
        description: 'Descrição do novo evento',
        date: '2025-06-15',
        time: '20:00',
        category: 'Cultura',
        organizerId: 2,
        locationId: 2,
      });

      const res = await request(app)
        .post('/tickets')
        .send({
          type: 'Standard',
          price: 30.0,
          quantityAvailable: 200,
          eventId: event.id,  // Usando o ID do evento recém-criado
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.type).toBe('Standard');
      expect(res.body.price).toBe(30.0);
      expect(res.body.quantityAvailable).toBe(200);
    });
  });

  // Restante dos testes como antes...
});

afterAll(async () => {
  // Fecha a conexão com o banco de dados após os testes
  await sequelize.close();
});
