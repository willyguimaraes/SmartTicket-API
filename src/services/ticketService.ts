// src/services/ticketService.ts
import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/ticket';
import { Event } from '../models/event';

export class TicketService {
  /**
   * Cria um novo ingresso associado a um evento.
   * @param type Tipo do ingresso.
   * @param price Preço do ingresso.
   * @param quantityAvailable Quantidade disponível.
   * @param eventId Identificador do evento.
   */
  static async createTicket(
    type: string,
    price: number,
    quantityAvailable: number,
    eventId: number
  ) {
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const eventRepository = AppDataSource.getRepository(Event);

    const event = await eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new Error('Evento não encontrado.');
    }

    const newTicket = ticketRepository.create({
      type,
      price,
      quantityAvailable,
      eventId,
    });
    await ticketRepository.save(newTicket);
    return newTicket;
  }

  /**
   * Retorna todos os ingressos.
   */
  static async getTickets() {
    const ticketRepository = AppDataSource.getRepository(Ticket);
    return await ticketRepository.find({ relations: ['event'] });
  }

  /**
   * Retorna um ingresso pelo identificador.
   * @param id Identificador do ingresso.
   */
  static async getTicketById(id: number) {
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOne({
      where: { id },
      relations: ['event'],
    });
    if (!ticket) {
      throw new Error('Ingresso não encontrado.');
    }
    return ticket;
  }

  /**
   * Atualiza os dados de um ingresso.
   * @param id Identificador do ingresso.
   * @param updateData Dados a serem atualizados.
   */
  static async updateTicket(id: number, updateData: Partial<Ticket>) {
    const ticketRepository = AppDataSource.getRepository(Ticket);
    let ticket = await ticketRepository.findOneBy({ id });
    if (!ticket) {
      throw new Error('Ingresso não encontrado.');
    }
    Object.assign(ticket, updateData);
    ticket = await ticketRepository.save(ticket);
    return ticket;
  }

  /**
   * Remove um ingresso.
   * @param id Identificador do ingresso.
   */
  static async deleteTicket(id: number) {
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const ticket = await ticketRepository.findOneBy({ id });
    if (!ticket) {
      throw new Error('Ingresso não encontrado.');
    }
    await ticketRepository.remove(ticket);
  }
}
