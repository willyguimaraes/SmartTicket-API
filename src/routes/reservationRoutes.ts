import express from 'express';
import * as reservationController from '../controllers/reservationController';

const router = express.Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Cria uma nova reserva
 *     description: Cria uma reserva para compra de ingressos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - eventId
 *               - ticketId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: number
 *               eventId:
 *                 type: number
 *               ticketId:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso.
 *       400:
 *         description: Dados inválidos ou quantidade insuficiente.
 */
router.post('/', reservationController.createReservation);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Lista as reservas
 *     description: Retorna todas as reservas ou filtra por usuário.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         description: Filtra as reservas de um usuário específico.
 *     responses:
 *       200:
 *         description: Lista de reservas.
 */
router.get('/', reservationController.getReservations);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Obtém uma reserva pelo ID
 *     description: Retorna os detalhes de uma reserva específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Detalhes da reserva.
 *       404:
 *         description: Reserva não encontrada.
 */
router.get('/:id', reservationController.getReservationById);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Remove uma reserva
 *     description: Exclui uma reserva específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva removida com sucesso.
 *       404:
 *         description: Reserva não encontrada.
 */
router.delete('/:id', reservationController.cancelReservation);

export default router;
