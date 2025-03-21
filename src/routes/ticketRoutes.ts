// src/routes/ticketRoutes.ts
import express from 'express';
import * as ticketController from '../controllers/ticketController';

const router = express.Router();

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Cria um novo ingresso
 *     description: Cria um ingresso vinculado a um evento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - price
 *               - quantityAvailable
 *               - eventId
 *             properties:
 *               type:
 *                 type: string
 *               price:
 *                 type: number
 *               quantityAvailable:
 *                 type: number
 *               eventId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ingresso criado com sucesso.
 *       404:
 *         description: Evento não encontrado.
 */
router.post('/', ticketController.createTicket);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Lista todos os ingressos
 *     responses:
 *       200:
 *         description: Retorna uma lista de ingressos.
 */
router.get('/', ticketController.getTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Obtém um ingresso pelo ID
 *     description: Retorna os detalhes de um ingresso específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do ingresso
 *     responses:
 *       200:
 *         description: Detalhes do ingresso.
 *       404:
 *         description: Ingresso não encontrado.
 */
router.get('/:id', ticketController.getTicketById);

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Atualiza um ingresso existente
 *     description: Atualiza os detalhes de um ingresso específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do ingresso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               price:
 *                 type: number
 *               quantityAvailable:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ingresso atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Ingresso não encontrado.
 */
router.put('/:id', ticketController.updateTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Remove um ingresso
 *     description: Exclui um ingresso específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do ingresso
 *     responses:
 *       200:
 *         description: Ingresso removido com sucesso.
 *       404:
 *         description: Ingresso não encontrado.
 */
router.delete('/:id', ticketController.deleteTicket);

export default router;
