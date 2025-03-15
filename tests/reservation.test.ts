// tests/reservation.test.ts

import request from 'supertest';
import app from '../src/index';

describe('Reservation API', () => {
  /**
   * Suite: POST /reservations
   * - Cenário de sucesso: Criação de uma nova reserva com dados válidos.
   * - Cenários de falha: Ticket não encontrado e quantidade insuficiente.
   */
  describe('POST /reservations', () => {
    it('deve criar uma nova reserva com dados válidos', async () => {
      const reservationData = {
        userId: 1,
        eventId: 1,
        ticketId: 1,
        quantity: 2
      };
      const res = await request(app)
        .post('/reservations')
        .send(reservationData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      // Você pode testar outras propriedades, como quantidade, se necessário
    });

    it('deve retornar 404 se o ticket não for encontrado', async () => {
      const reservationData = {
        userId: 1,
        eventId: 1,
        ticketId: 9999, // ID inexistente
        quantity: 1
      };
      const res = await request(app)
        .post('/reservations')
        .send(reservationData);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Ingresso não encontrado.');
    });

    it('deve retornar 400 se a quantidade for maior que a disponível', async () => {
      const reservationData = {
        userId: 1,
        eventId: 1,
        ticketId: 1,
        quantity: 9999 // Quantidade alta para forçar erro
      };
      const res = await request(app)
        .post('/reservations')
        .send(reservationData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Quantidade de ingressos indisponível.');
    });
  });

  /**
   * Suite: GET /reservations
   * - Retorna todas as reservas ou filtra por userId.
   */
  describe('GET /reservations', () => {
    it('deve retornar uma lista de reservas', async () => {
      const res = await request(app).get('/reservations');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('deve filtrar reservas por userId se informado', async () => {
      const res = await request(app).get('/reservations').query({ userId: 1 });
      expect(res.status).toBe(200);
      if (res.body.length > 0) {
        res.body.forEach((reservation: any) => {
          // Se a reserva estiver associada, verifique que o usuário seja o esperado.
          expect(reservation.user?.id || reservation.userId).toBe(1);
        });
      }
    });
  });

  /**
   * Suite: GET /reservations/:id
   * - Cenário de sucesso: Retorna os detalhes de uma reserva existente.
   * - Cenário de falha: Reserva inexistente.
   */
  describe('GET /reservations/:id', () => {
    it('deve retornar os detalhes de uma reserva existente', async () => {
      // Primeiro, cria uma reserva para garantir que ela exista.
      const createRes = await request(app)
        .post('/reservations')
        .send({
          userId: 1,
          eventId: 1,
          ticketId: 1,
          quantity: 1
        });
      const reservationId = createRes.body.id;
      const res = await request(app).get(`/reservations/${reservationId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', reservationId);
    });

    it('deve retornar 404 para reserva inexistente', async () => {
      const res = await request(app).get('/reservations/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Reserva não encontrada.');
    });
  });

  /**
   * Suite: DELETE /reservations/:id (Cancelamento)
   * - Cenário de sucesso: Cancela a reserva e reverte a quantidade.
   * - Cenário de falha: Reserva inexistente.
   */
  describe('DELETE /reservations/:id', () => {
    it('deve cancelar uma reserva existente com sucesso', async () => {
      // Cria uma reserva para ser cancelada.
      const createRes = await request(app)
        .post('/reservations')
        .send({
          userId: 1,
          eventId: 1,
          ticketId: 1,
          quantity: 1
        });
      const reservationId = createRes.body.id;
      const res = await request(app).delete(`/reservations/${reservationId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Reserva cancelada com sucesso.');
    });

    it('deve retornar 404 ao tentar cancelar uma reserva inexistente', async () => {
      const res = await request(app).delete('/reservations/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Reserva não encontrada.');
    });
  });
});
