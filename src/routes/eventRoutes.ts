import express from 'express';
import * as eventController from '../controllers/eventController';

const router = express.Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     description: Permite que um organizador crie um evento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - time
 *               - category
 *               - organizerId
 *               - locationId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               category:
 *                 type: string
 *               organizerId:
 *                 type: number
 *               locationId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 *       400:
 *         description: Dados inválidos ou organizador/local não encontrado.
 */
router.post('/', eventController.createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lista todos os eventos
 *     description: Retorna a lista de eventos, com possibilidade de filtros.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtra eventos por data.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtra eventos por categoria.
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filtra eventos por local.
 *     responses:
 *       200:
 *         description: Lista de eventos.
 */
router.get('/', eventController.getEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Obtém um evento pelo ID
 *     description: Retorna os detalhes de um evento específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Detalhes do evento.
 *       404:
 *         description: Evento não encontrado.
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento existente
 *     description: Atualiza os detalhes de um evento específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               category:
 *                 type: string
 *               locationId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Evento não encontrado.
 */
router.put('/:id', eventController.updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento
 *     description: Exclui um evento específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento removido com sucesso.
 *       404:
 *         description: Evento não encontrado.
 */
router.delete('/:id', eventController.deleteEvent);

export default router;
