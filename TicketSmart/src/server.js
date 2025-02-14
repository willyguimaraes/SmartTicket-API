import express, { json } from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON
app.use(json());

// Importação das rotas
import usersRouter from './routes/users';
import eventsRouter from './routes/events';
import locationsRouter from './routes/locations';
import ticketsRouter from './routes/tickets';
import purchasesRouter from './routes/purchases';

// Definição das rotas
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/locations', locationsRouter);
app.use('/tickets', ticketsRouter);
app.use('/purchases', purchasesRouter);

// Rota exemplo para teste
app.get('/', (req, res) => {
  res.send('Sistema de Gestão de Eventos e Ingressos - API funcionando!');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
