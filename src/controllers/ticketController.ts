import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/ticket';
import { Event } from '../models/event';

/**
 * Cria um novo ingresso vinculado a um evento.
 */
export const createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, price, quantityAvailable, eventId } = req.body;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const eventRepository = AppDataSource.getRepository(Event);

    const event = await eventRepository.findOneBy({ id: eventId });
    if (!event) {
      res.status(404).json({ message: 'Evento não encontrado.' });
      return;
    }

    const newTicket = ticketRepository.create({
      type,
      price,
      quantityAvailable,
      eventId,
    });
    await ticketRepository.save(newTicket);
    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Erro ao criar ingresso:', error);
    next(error);
  }
};

/**
 * Retorna a lista de ingressos.
 */
export const getTickets = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const tickets = await ticketRepository.find({ relations: ['event'] });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Erro ao buscar ingressos:', error);
    next(error);
  }
};

/**
 * Retorna um ingresso pelo ID.
 */
export const getTicketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOne({
      where: { id: Number(id) },
      relations: ['event'],
    });
    if (!ticket) {
      res.status(404).json({ message: 'Ingresso não encontrado.' });
      return;
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Erro ao buscar ingresso:', error);
    next(error);
  }
};

/**
 * Atualiza os dados de um ingresso.
 */
export const updateTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    let ticket = await ticketRepository.findOneBy({ id: Number(id) });
    if (!ticket) {
      res.status(404).json({ message: 'Ingresso não encontrado.' });
      return;
    }
    ticket.type = req.body.type || ticket.type;
    ticket.price = req.body.price || ticket.price;
    ticket.quantityAvailable = req.body.quantityAvailable || ticket.quantityAvailable;
    ticket = await ticketRepository.save(ticket);
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Erro ao atualizar ingresso:', error);
    next(error);
  }
};

/**
 * Remove um ingresso.
 */
export const deleteTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOneBy({ id: Number(id) });
    if (!ticket) {
      res.status(404).json({ message: 'Ingresso não encontrado.' });
      return;
    }
    await ticketRepository.remove(ticket);
    res.status(200).json({ message: 'Ingresso removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover ingresso:', error);
    next(error);
  }
};
