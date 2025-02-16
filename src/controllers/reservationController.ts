// src/controllers/reservationController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Reservation } from '../models/reservation';
import { Ticket } from '../models/ticket';
import { Event } from '../models/event';
import { User } from '../models/user';

/**
 * Cria uma nova reserva (compra de ingresso).
 * Verifica a disponibilidade e atualiza o estoque em transação.
 */
export const createReservation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, eventId, ticketId, quantity } = req.body;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['event'],
    });
    if (!ticket) {
      return res.status(404).json({ message: 'Ingresso não encontrado.' });
    }
    if (ticket.quantityAvailable < quantity) {
      return res.status(400).json({ message: 'Quantidade de ingressos indisponível.' });
    }

    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      ticket.quantityAvailable -= quantity;
      await transactionalEntityManager.save(ticket);

      const reservationRepository = transactionalEntityManager.getRepository(Reservation);
      const userRepository = transactionalEntityManager.getRepository(User);
      const eventRepository = transactionalEntityManager.getRepository(Event);

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) throw new Error('Usuário não encontrado.');
      const event = await eventRepository.findOneBy({ id: eventId });
      if (!event) throw new Error('Evento não encontrado.');

      const newReservation = reservationRepository.create({
        quantity,
        user,
        event,
        ticket,
      });
      await reservationRepository.save(newReservation);
      res.status(201).json(newReservation);
    });
    return res;
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Lista as reservas. Se for informado um userId na query, filtra pelas reservas do usuário.
 */
export const getReservations = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.query;
    const reservationRepository = AppDataSource.getRepository(Reservation);
    let reservations;
    if (userId) {
      reservations = await reservationRepository.find({
        where: { user: { id: Number(userId) } },
        relations: ['user', 'event', 'ticket'],
      });
    } else {
      reservations = await reservationRepository.find({ relations: ['user', 'event', 'ticket'] });
    }
    return res.status(200).json(reservations);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Retorna uma reserva pelo ID.
 */
export const getReservationById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const reservation = await reservationRepository.findOne({
      where: { id: Number(id) },
      relations: ['user', 'event', 'ticket'],
    });
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }
    return res.status(200).json(reservation);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Cancela uma reserva, revertendo a quantidade disponível do ingresso.
 */
export const cancelReservation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const reservation = await reservationRepository.findOne({
      where: { id: Number(id) },
      relations: ['ticket'],
    });
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }

    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const ticket = reservation.ticket;
      ticket.quantityAvailable += reservation.quantity;
      await transactionalEntityManager.save(ticket);
      await transactionalEntityManager.remove(reservation);
    });
    return res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
