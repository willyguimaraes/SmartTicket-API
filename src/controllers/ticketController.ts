// src/controllers/ticketController.ts
import { Request, Response, NextFunction } from "express";
import Ticket from "../models/ticket";
import Event from "../models/event";

/**
 * Cria um novo ingresso vinculado a um evento.
 */
export const createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, price, quantityAvailable, eventId } = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) {
      res.status(404).json({ message: "Evento não encontrado." });
      return;
    }
    const newTicket = await Ticket.create({ type, price, quantityAvailable, eventId });
    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Erro ao criar ingresso:", error);
    next(error);
  }
};

/**
 * Retorna a lista de ingressos.
 */
export const getTickets = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tickets = await Ticket.findAll({
      include: [{ model: Event, as: "event" }],
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Erro ao buscar ingressos:", error);
    next(error);
  }
};

/**
 * Retorna um ingresso pelo ID.
 */
export const getTicketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(Number(id), {
      include: [{ model: Event, as: "event" }],
    });
    if (!ticket) {
      res.status(404).json({ message: "Ingresso não encontrado." });
      return;
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Erro ao buscar ingresso:", error);
    next(error);
  }
};

/**
 * Atualiza os dados de um ingresso.
 */
export const updateTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(Number(id));
    if (!ticket) {
      res.status(404).json({ message: "Ingresso não encontrado." });
      return;
    }
    ticket.type = req.body.type || ticket.type;
    ticket.price = req.body.price || ticket.price;
    ticket.quantityAvailable = req.body.quantityAvailable || ticket.quantityAvailable;
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Erro ao atualizar ingresso:", error);
    next(error);
  }
};

/**
 * Remove um ingresso.
 */
export const deleteTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(Number(id));
    if (!ticket) {
      res.status(404).json({ message: "Ingresso não encontrado." });
      return;
    }
    await ticket.destroy();
    res.status(200).json({ message: "Ingresso removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover ingresso:", error);
    next(error);
  }
};
