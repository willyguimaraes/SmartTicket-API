import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Reservation } from '../models/reservation';
import { Ticket } from '../models/ticket';
import { Event } from '../models/event';
import { User } from '../models/user';

/**
 * Cria uma nova reserva (compra de ingresso).
 * Verifica a disponibilidade e atualiza o estoque em transação.
 */
export const createReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, eventId, ticketId, quantity } = req.body;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['event'],
    });
    if (!ticket) {
      res.status(404).json({ message: 'Ingresso não encontrado.' });
      return;
    }
    if (ticket.quantityAvailable < quantity) {
      res.status(400).json({ message: 'Quantidade de ingressos indisponível.' });
      return;
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

      // Cria a reserva utilizando as chaves estrangeiras
      const newReservation = reservationRepository.create({
        quantity,
        userId,  
        eventId, 
        ticketId,
      });
      await reservationRepository.save(newReservation);
      res.status(201).json(newReservation);
    });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    next(error);
  }
};

/**
 * Lista as reservas. Se for informado um userId na query, filtra pelas reservas do usuário.
 */
export const getReservations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.query;
    const reservationRepository = AppDataSource.getRepository(Reservation);
    let reservations;
    if (userId) {
      reservations = await reservationRepository.find({
        where: { userId: Number(userId) },
        relations: ['user', 'event', 'ticket'],
      });
    } else {
      reservations = await reservationRepository.find({ relations: ['user', 'event', 'ticket'] });
    }
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    next(error);
  }
};

/**
 * Retorna uma reserva pelo ID.
 */
export const getReservationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const reservation = await reservationRepository.findOne({
      where: { id: Number(id) },
      relations: ['user', 'event', 'ticket'],
    });
    if (!reservation) {
      res.status(404).json({ message: 'Reserva não encontrada.' });
      return;
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    next(error);
  }
};

/**
 * Cancela uma reserva, revertendo a quantidade disponível do ingresso.
 */
export const cancelReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const reservation = await reservationRepository.findOne({
      where: { id: Number(id) },
      relations: ['ticket'],
    });
    if (!reservation) {
      res.status(404).json({ message: 'Reserva não encontrada.' });
      return;
    }

    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const ticket = reservation.ticket;
      if (!ticket) throw new Error('Ticket não encontrado na reserva.');
      ticket.quantityAvailable += reservation.quantity;
      await transactionalEntityManager.save(ticket);
      await transactionalEntityManager.remove(reservation);
    });
    res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    next(error);
  }
};
