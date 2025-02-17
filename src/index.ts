// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';

// Carrega variáveis de ambiente
dotenv.config();

// Importa a instância do Sequelize e os models
import sequelize from './config/database'; // instância do Sequelize configurada
import User from './models/user';
import Event from './models/event';
import Ticket from './models/ticket';
import Location from './models/location';
import Reservation from './models/reservation';

// Definindo as associações entre os models

// Um usuário pode organizar muitos eventos e ter muitas reservas
User.hasMany(Event, { foreignKey: 'organizerId', as: 'events' });
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });

// Um evento pertence a um organizador (usuário) e a um local; 
// um evento tem muitos tickets e reservas
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
Event.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
Event.hasMany(Ticket, { foreignKey: 'eventId', as: 'tickets' });
Event.hasMany(Reservation, { foreignKey: 'eventId', as: 'reservations' });

// Um ticket pertence a um evento
Ticket.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Um local pode ter muitos eventos
Location.hasMany(Event, { foreignKey: 'locationId', as: 'events' });

// Uma reserva pertence a um usuário, a um evento e a um ticket
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Reservation.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
Reservation.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// Configura o servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Smart Ticket API está funcionando!' });
});

// Sincroniza o banco de dados e inicia o servidor
sequelize
  .sync({ force: false }) // force: false evita recriação das tabelas em cada reinicialização (use true apenas em desenvolvimento)
  .then(() => {
    console.log('Banco de dados sincronizado.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco de dados:', error);
  });
