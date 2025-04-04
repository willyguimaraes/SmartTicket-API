// src/app.ts
import express from 'express';
import eventRoutes from './routes/eventRoutes';
import locationRoutes from './routes/locationRoutes';
import reservationRoutes from './routes/reservationRoutes';
import ticketRoutes from './routes/ticketRoutes';
import userRoutes from './routes/userRoutes';
import cors from "cors";

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Habilita o CORS para todas as requisições
app.use(cors());

// Registra as rotas com seus respectivos caminhos base
app.use('/events', eventRoutes);
app.use('/locations', locationRoutes);
app.use('/reservations', reservationRoutes);
app.use('/tickets', ticketRoutes);
app.use('/users', userRoutes);

export default app;
