// tests/user.test.ts
import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/config/database';

describe('User API', () => {
  beforeAll(async () => {
    // Certifique-se de que o banco está sincronizado para os testes
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Feche a conexão com o banco de dados após os testes
    await sequelize.close();
  });

  // Suite: POST /users/register
  describe('POST /users/register', () => {
    it('deve criar um novo usuário com dados válidos', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: '123456',
          role: 'client'
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('testuser@example.com');
    });

    it('deve retornar erro para dados inválidos (campos faltantes)', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          email: 'invalid@example.com' // Falta nome e senha
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: POST /users/login
  describe('POST /users/login', () => {
    it('deve autenticar usuário com credenciais válidas e retornar token JWT', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'testuser@example.com',
          password: '123456'
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('deve retornar erro para senha incorreta', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'testuser@example.com',
          password: 'senhaerrada'
        });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('deve retornar erro para usuário inexistente', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'naoexiste@example.com',
          password: '123456'
        });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: GET /users/:id
  describe('GET /users/:id', () => {
    it('deve retornar os detalhes de um usuário existente', async () => {
      const res = await request(app).get('/users/1'); // Presume que o ID 1 exista
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name');
    });

    it('deve retornar 404 para usuário não existente', async () => {
      const res = await request(app).get('/users/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: PUT /users/:id
  describe('PUT /users/:id', () => {
    it('deve atualizar os dados de um usuário existente', async () => {
      const res = await request(app)
        .put('/users/1')
        .send({ name: 'Updated User' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated User');
    });

    it('deve retornar 404 ao tentar atualizar usuário inexistente', async () => {
      const res = await request(app)
        .put('/users/9999')
        .send({ name: 'Non Existent' });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Suite: DELETE /users/:id
  describe('DELETE /users/:id', () => {
    it('deve excluir um usuário existente', async () => {
      const res = await request(app).delete('/users/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('deve retornar 404 ao tentar excluir usuário inexistente', async () => {
      const res = await request(app).delete('/users/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
