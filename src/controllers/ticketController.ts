// src/controllers/ticketController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/ticket';
import { Event } from '../models/event';

/**
 * Cria um novo ingresso vinculado a um evento.
 */
export const createTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { type, price, quantityAvailable, eventId } = req.body;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const eventRepository = AppDataSource.getRepository(Event);

    const event = await eventRepository.findOneBy({ id: eventId });
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    const newTicket = ticketRepository.create({
      type,
      price,
      quantityAvailable,
      event,
    });
    await ticketRepository.save(newTicket);
    return res.status(201).json(newTicket);
  } catch (error) {
    console.error('Erro ao criar ingresso:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Retorna a lista de ingressos.
 */
export const getTickets = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const tickets = await ticketRepository.find({ relations: ['event'] });
    return res.status(200).json(tickets);
  } catch (error) {
    console.error('Erro ao buscar ingressos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Retorna um ingresso pelo ID.
 */
export const getTicketById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOne({
      where: { id: Number(id) },
      relations: ['event'],
    });
    if (!ticket) {
      return res.status(404).json({ message: 'Ingresso não encontrado.' });
    }
    return res.status(200).json(ticket);
  } catch (error) {
    console.error('Erro ao buscar ingresso:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Atualiza os dados de um ingresso.
 */
export const updateTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    let ticket = await ticketRepository.findOneBy({ id: Number(id) });
    if (!ticket) {
      return res.status(404).json({ message: 'Ingresso não encontrado.' });
    }
    ticket.type = req.body.type || ticket.type;
    ticket.price = req.body.price || ticket.price;
    ticket.quantityAvailable = req.body.quantityAvailable || ticket.quantityAvailable;
    ticket = await ticketRepository.save(ticket);
    return res.status(200).json(ticket);
  } catch (error) {
    console.error('Erro ao atualizar ingresso:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Remove um ingresso.
 */
export const deleteTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOneBy({ id: Number(id) });
    if (!ticket) {
      return res.status(404).json({ message: 'Ingresso não encontrado.' });
    }
    await ticketRepository.remove(ticket);
    return res.status(200).json({ message: 'Ingresso removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover ingresso:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
