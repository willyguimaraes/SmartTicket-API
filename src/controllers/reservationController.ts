import { Request, Response, NextFunction } from "express";
import Reservation from "../models/reservation"; 
import Ticket from "../models/ticket";
import User from "../models/user";

export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity, userId, eventId, ticketId } = req.body;

    // Verifica se o ticket existe 
   
  
    // Verifica se há ingressos disponíveis
    const ticket = await Ticket.findByPk(ticketId);
    
    if (!ticket) {
      return res.status(404).json({ error: "Ingressos não encontrados." });
    };
    if (ticket.quantityAvailable < quantity) {
      return res.status(400).json({ error: "Quantidade de ingressos indisponível." });
    }

    // Verifica se o usuário existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Cria a reserva
    const reservation = await Reservation.create({
      quantity,
      userId,
      eventId,
      ticketId,
    });

    // Atualiza a quantidade disponível de ingressos
    ticket.quantityAvailable -= quantity;
    await ticket.save();

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    next(error);
  }
};

export const getReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Se for passado userId como query, filtra as reservas desse usuário
    const userId = req.query.userId as string;
    let reservations;

    if (userId) {
      reservations = await Reservation.findAll({
        where: { userId: Number(userId) },
        include: ["user", "event", "ticket"],
      });
    } else {
      reservations = await Reservation.findAll({
        include: ["user", "event", "ticket"],
      });
    }

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    next(error);
  }
};

export const getReservationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id, {
      include: ["user", "event", "ticket"],
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    next(error);
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    // Atualiza a quantidade disponível do ticket
    const ticket = await Ticket.findByPk(reservation.ticketId);
    if (ticket) {
      ticket.quantityAvailable += reservation.quantity;
      await ticket.save();
    }

    await reservation.destroy();

    res.status(200).json({ message: "Reserva cancelada com sucesso." });
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    next(error);
  }
};
