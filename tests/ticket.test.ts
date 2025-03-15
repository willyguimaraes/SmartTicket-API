// tests/ticket.test.ts

import request from 'supertest';
import app from '../src/index';

describe('Ticket API', () => {
  // Suite: POST /tickets
  describe('POST /tickets', () => {
    it('deve criar um novo ingresso com dados válidos', async () => {
      const res = await request(app)
        .post('/tickets')
        .send({
          event_id: 1,
          ticket_type: 'VIP',
          price: 50.0,
          total_quantity: 100
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.ticket_type).toBe('VIP');
    });

    it('deve retornar erro para dados inválidos', async () => {
      const res = await request(app)
        .post('/tickets')
        .send({ ticket_type: 'VIP' }); // Dados insuficientes
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: GET /tickets e GET /tickets/:id
  describe('GET /tickets', () => {
    it('deve retornar uma lista de ingressos', async () => {
      const res = await request(app).get('/tickets');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /tickets/:id', () => {
    it('deve retornar os detalhes de um ingresso existente', async () => {
      const res = await request(app).get('/tickets/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('ticket_type');
    });

    it('deve retornar 404 para ingresso não existente', async () => {
      const res = await request(app).get('/tickets/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: PUT /tickets/:id
  describe('PUT /tickets/:id', () => {
    it('deve atualizar os dados de um ingresso existente', async () => {
      const res = await request(app)
        .put('/tickets/1')
        .send({ price: 60.0 });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('price', 60.0);
    });

    it('deve retornar 404 ao tentar atualizar ingresso inexistente', async () => {
      const res = await request(app)
        .put('/tickets/9999')
        .send({ price: 60.0 });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: DELETE /tickets/:id
  describe('DELETE /tickets/:id', () => {
    it('deve excluir um ingresso existente', async () => {
      const res = await request(app).delete('/tickets/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar 404 ao tentar excluir ingresso inexistente', async () => {
      const res = await request(app).delete('/tickets/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
