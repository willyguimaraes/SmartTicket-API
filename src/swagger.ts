// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function setupSwagger(app: Express): void {
  // Definição das opções do Swagger
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Smart Ticket API',
        version: '1.0.0',
        description: 'API para gerenciamento de eventos, reservas, ingressos e usuários.',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor de desenvolvimento',
        },
      ],
    },
    // Define os arquivos onde estão as anotações JSDoc (ou Swagger) para documentar os endpoints
    apis: ['src/routes/*.ts', 'src/models/*.ts', 'src/controllers/*.ts'],
  };

  // Gera a especificação do Swagger
  const swaggerSpec = swaggerJSDoc(options);

  // Configura a rota para servir o Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
