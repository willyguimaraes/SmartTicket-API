// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';


// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Smart Ticket API está funcionando!' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
