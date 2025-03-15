// tests/location.test.ts

import request from 'supertest';
import app from '../src/index';

describe('Location API', () => {
  // Suite: POST /locations
  describe('POST /locations', () => {
    it('deve criar um novo local com dados válidos', async () => {
      const res = await request(app)
        .post('/locations')
        .send({
          name: 'Test Location',
          address: '123 Test Street',
          capacity: 100
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Test Location');
    });

    it('deve retornar erro para dados inválidos', async () => {
      const res = await request(app)
        .post('/locations')
        .send({ address: 'No Name Street' }); // Falta nome e capacidade
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: GET /locations e GET /locations/:id
  describe('GET /locations', () => {
    it('deve retornar uma lista de locais', async () => {
      const res = await request(app).get('/locations');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /locations/:id', () => {
    it('deve retornar os detalhes de um local existente', async () => {
      const res = await request(app).get('/locations/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name');
    });

    it('deve retornar 404 para local não existente', async () => {
      const res = await request(app).get('/locations/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: PUT /locations/:id
  describe('PUT /locations/:id', () => {
    it('deve atualizar os dados de um local existente', async () => {
      const res = await request(app)
        .put('/locations/1')
        .send({ name: 'Updated Location' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Location');
    });

    it('deve retornar 404 ao tentar atualizar local inexistente', async () => {
      const res = await request(app)
        .put('/locations/9999')
        .send({ name: 'Non Existent Location' });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: DELETE /locations/:id
  describe('DELETE /locations/:id', () => {
    it('deve excluir um local existente', async () => {
      const res = await request(app).delete('/locations/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar 404 ao tentar excluir local inexistente', async () => {
      const res = await request(app).delete('/locations/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
