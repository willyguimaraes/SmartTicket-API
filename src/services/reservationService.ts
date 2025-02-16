// src/services/reservationService.ts
import { AppDataSource } from '../config/data-source';
import { Reservation } from '../models/reservation';
import { Ticket } from '../models/ticket';
import { Event } from '../models/event';
import { User } from '../models/user';

export class ReservationService {
  /**
   * Cria uma nova reserva (compra de ingresso).
   * Verifica a disponibilidade do ingresso e realiza a operação em transação.
   * @param userId Identificador do usuário.
   * @param eventId Identificador do evento.
   * @param ticketId Identificador do ingresso.
   * @param quantity Quantidade de ingressos.
   */
  static async createReservation(
    userId: number,
    eventId: number,
    ticketId: number,
    quantity: number
  ) {
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['event'],
    });
    if (!ticket) {
      throw new Error('Ingresso não encontrado.');
    }
    if (ticket.quantityAvailable < quantity) {
      throw new Error('Quantidade insuficiente de ingressos.');
    }

    const reservation = await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      ticket.quantityAvailable -= quantity;
      await transactionalEntityManager.save(ticket);

      const userRepository = transactionalEntityManager.getRepository(User);
      const eventRepository = transactionalEntityManager.getRepository(Event);
      const reservationRepository = transactionalEntityManager.getRepository(Reservation);

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
      return newReservation;
    });

    return reservation;
  }

  /**
   * Retorna as reservas, opcionalmente filtradas por usuário.
   * @param userId (Opcional) Identificador do usuário para filtrar as reservas.
   */
  static async getReservations(userId?: number) {
    const reservationRepository = AppDataSource.getRepository(Reservation);
    let reservations;
    if (userId) {
      reservations = await reservationRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'event', 'ticket'],
      });
    } else {
      reservations = await reservationRepository.find({ relations: ['user', 'event', 'ticket'] });
    }
    return reservations;
  }

  /**
   * Retorna uma reserva pelo identificador.
   * @param id Identificador da reserva.
   */
  static async getReservationById(id: number) {
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const reservation = await reservationRepository.findOne({
      where: { id },
      relations: ['user', 'event', 'ticket'],
    });
    if (!reservation) {
      throw new Error('Reserva não encontrada.');
    }
    return reservation;
  }

  /**
   * Cancela uma reserva, revertendo a quantidade do ingresso.
   * @param id Identificador da reserva.
   */
  static async cancelReservation(id: number) {
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const reservation = await reservationRepository.findOne({
      where: { id },
      relations: ['ticket'],
    });
    if (!reservation) {
      throw new Error('Reserva não encontrada.');
    }
    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const ticket = reservation.ticket;
      ticket.quantityAvailable += reservation.quantity;
      await transactionalEntityManager.save(ticket);
      await transactionalEntityManager.remove(reservation);
    });
  }
}
