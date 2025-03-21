// tests/location.test.ts
import request from 'supertest';
import app from '../src/app'; // Supondo que seu app esteja configurado corretamente

let locationId: number;

beforeAll(async () => {
  // Cria um local de teste antes de executar os testes
  const response = await request(app)
    .post('/locations')
    .send({
      name: 'Test Location',
      address: 'Test Address',
      capacity: 100
    });
  
  // Verifica se a criação do local foi bem-sucedida
  console.log('Local criado:', response.body);
  if (response.status !== 201) {
    throw new Error('Falha ao criar o local para os testes');
  }

  locationId = response.body.id; // Armazena o ID do local criado para os testes posteriores

  // Verifique se o ID foi realmente atribuído
  if (!locationId) {
    throw new Error('Falha ao obter o ID do local criado');
  }
});

describe('Location API', () => {
  // Teste de POST /locations
  it('deve criar um novo local com dados válidos', async () => {
    const res = await request(app)
      .post('/locations')
      .send({ 
        name: 'New Location',
        address: 'New Address',
        capacity: 50
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'New Location');
    expect(res.body).toHaveProperty('address', 'New Address');
    expect(res.body).toHaveProperty('capacity', 50);
  });

  // Teste de POST /locations com dados inválidos
  it('deve retornar erro para dados inválidos', async () => {
    const res = await request(app)
      .post('/locations')
      .send({
        name: '',
        address: '',
        capacity: 'invalid'
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Dados inválidos');
  });

  // Teste de GET /locations
  it('deve retornar uma lista de locais', async () => {
    const res = await request(app).get('/locations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // Espera pelo menos um local
  });

  // Teste de GET /locations/:id (com ID válido)
  it('deve retornar os detalhes de um local existente', async () => {
    const res = await request(app).get(`/locations/${locationId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('address');
    expect(res.body).toHaveProperty('capacity');
  });

  // Teste de GET /locations/:id (com ID inválido)
  it('deve retornar 404 para local não existente', async () => {
    const res = await request(app).get('/locations/9999'); // ID que não existe
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Local não encontrado.');
  });

  // Teste de PUT /locations/:id
  it('deve atualizar os dados de um local existente', async () => {
    const res = await request(app)
      .put(`/locations/${locationId}`)
      .send({ name: 'Updated Location' });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Location');
    expect(res.body).toHaveProperty('address');
    expect(res.body).toHaveProperty('capacity');
  });

  // Teste de PUT /locations/:id (com ID inválido)
  it('deve retornar 404 ao tentar atualizar local inexistente', async () => {
    const res = await request(app)
      .put('/locations/9999') // ID que não existe
      .send({ name: 'Non-existent Location' });
    
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Local não encontrado.');
  });

  // Teste de DELETE /locations/:id
  it('deve excluir um local existente', async () => {
    const res = await request(app).delete(`/locations/${locationId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Local removido com sucesso.');
  });

  // Teste de DELETE /locations/:id (com ID inválido)
  it('deve retornar 404 ao tentar excluir local inexistente', async () => {
    const res = await request(app).delete('/locations/9999'); // ID que não existe
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Local não encontrado.');
  });
});
