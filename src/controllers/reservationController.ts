// src/controllers/reservationController.ts
import { Request, Response, NextFunction } from "express";
import sequelize from "../config/database";
import Reservation from "../models/reservation";
import Ticket from "../models/ticket";
import Event from "../models/event";
import User from "../models/user";

/**
 * Cria uma nova reserva (compra de ingresso).
 * Verifica a disponibilidade e atualiza o estoque em transação.
 */
export const createReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, eventId, ticketId, quantity } = req.body;
  try {
    const ticket = await Ticket.findByPk(ticketId, { include: [{ model: Event, as: "event" }] });
    if (!ticket) {
      res.status(404).json({ message: "Ingresso não encontrado." });
      return;
    }
    if (ticket.quantityAvailable < quantity) {
      res.status(400).json({ message: "Quantidade de ingressos indisponível." });
      return;
    }

    await sequelize.transaction(async (t) => {
      ticket.quantityAvailable -= quantity;
      await ticket.save({ transaction: t });

      const user = await User.findByPk(userId, { transaction: t });
      if (!user) throw new Error("Usuário não encontrado.");
      const event = await Event.findByPk(eventId, { transaction: t });
      if (!event) throw new Error("Evento não encontrado.");

      const newReservation = await Reservation.create(
        { quantity, userId, eventId, ticketId },
        { transaction: t }
      );
      res.status(201).json(newReservation);
    });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    next(error);
  }
};

/**
 * Lista as reservas. Se for informado um userId na query, filtra pelas reservas do usuário.
 */
export const getReservations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.query;
    const queryOptions: any = {
      include: [
        { model: User, as: "user" },
        { model: Event, as: "event" },
        { model: Ticket, as: "ticket" },
      ],
    };
    if (userId) {
      queryOptions.where = { userId: Number(userId) };
    }
    const reservations = await Reservation.findAll(queryOptions);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    next(error);
  }
};

/**
 * Retorna uma reserva pelo ID.
 */
export const getReservationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(Number(id), {
      include: [
        { model: User, as: "user" },
        { model: Event, as: "event" },
        { model: Ticket, as: "ticket" },
      ],
    });
    if (!reservation) {
      res.status(404).json({ message: "Reserva não encontrada." });
      return;
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    next(error);
  }
};

/**
 * Cancela uma reserva, revertendo a quantidade disponível do ingresso.
 */
export const cancelReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findByPk(Number(id), {
      include: [{ model: Ticket, as: "ticket" }],
    });
    if (!reservation) {
      res.status(404).json({ message: "Reserva não encontrada." });
      return;
    }
    await sequelize.transaction(async (t) => {
      const ticket = reservation.ticket;
      if (!ticket) throw new Error("Ticket não encontrado na reserva.");
      ticket.quantityAvailable += reservation.quantity;
      await ticket.save({ transaction: t });
      await reservation.destroy({ transaction: t });
    });
    res.status(200).json({ message: "Reserva cancelada com sucesso." });
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    next(error);
  }
};
