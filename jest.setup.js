// jest.setup.js
import { sequelize } from './src/database';  // Certifique-se de que o caminho esteja correto

beforeAll(async () => {
  console.log("Iniciando configuração de testes...");
  await sequelize.sync({ force: true });
  console.log("Banco de dados sincronizado.");
});

afterAll(async () => {
  console.log("Finalizando testes...");
  await sequelize.close();
});
