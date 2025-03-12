// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';

// Carrega variáveis de ambiente
dotenv.config();

// Importa a instância do Sequelize e os models
import sequelize from './config/database';
import User from './models/user';
import Event from './models/event';
import Ticket from './models/ticket';
import Location from './models/location';
import Reservation from './models/reservation';

// Define as associações entre os models
User.hasMany(Event, { foreignKey: 'organizerId', as: 'events' });
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
Event.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
Event.hasMany(Ticket, { foreignKey: 'eventId', as: 'tickets' });
Event.hasMany(Reservation, { foreignKey: 'eventId', as: 'reservations' });
Ticket.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
Location.hasMany(Event, { foreignKey: 'locationId', as: 'events' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Reservation.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
Reservation.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// Cria a aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuração do Swagger
import { setupSwagger } from './swagger';
setupSwagger(app);

// Monta as rotas
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import ticketRoutes from './routes/ticketRoutes';
import locationRoutes from './routes/locationRoutes';
import reservationRoutes from './routes/reservationRoutes';

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/tickets', ticketRoutes);
app.use('/locations', locationRoutes);
app.use('/reservations', reservationRoutes);

// Rota de teste
/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota de teste
 *     description: Retorna uma mensagem confirmando que a API está funcionando.
 *     responses:
 *       200:
 *         description: Mensagem de sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Smart Ticket API está funcionando!' });
});

// Sincroniza o banco de dados e inicia o servidor
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Banco de dados sincronizado.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco de dados:', error);
  });

export default app;

