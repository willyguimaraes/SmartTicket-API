// src/app.ts
import express from 'express';
import eventRoutes from './routes/eventRoutes';
import locationRoutes from './routes/locationRoutes';
import reservationRoutes from './routes/reservationRoutes';
import ticketRoutes from './routes/ticketRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Registra as rotas com seus respectivos caminhos base
app.use('/events', eventRoutes);
app.use('/locations', locationRoutes);
app.use('/reservations', reservationRoutes);
app.use('/tickets', ticketRoutes);
app.use('/users', userRoutes);

export default app;
