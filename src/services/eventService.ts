// src/services/eventService.ts
import { AppDataSource } from '../config/data-source';
import { Event } from '../models/event';
import { User } from '../models/user';
import { Location } from '../models/location';
import { Like } from 'typeorm';

export class EventService {
  /**
   * Cria um novo evento.
   * @param title Título do evento.
   * @param description Descrição do evento.
   * @param date Data do evento.
   * @param time Horário do evento.
   * @param category Categoria do evento.
   * @param organizerId Identificador do organizador.
   * @param locationId Identificador do local.
   */
  static async createEvent(
    title: string,
    description: string,
    date: Date,
    time: string,
    category: string,
    organizerId: number,
    locationId: number
  ) {
    const eventRepository = AppDataSource.getRepository(Event);
    const userRepository = AppDataSource.getRepository(User);
    const locationRepository = AppDataSource.getRepository(Location);

    const organizer = await userRepository.findOneBy({ id: organizerId });
    if (!organizer) {
      throw new Error('Organizador não encontrado.');
    }
    const location = await locationRepository.findOneBy({ id: locationId });
    if (!location) {
      throw new Error('Local não encontrado.');
    }

    const newEvent = eventRepository.create({
      title,
      description,
      date,
      time,
      category,
      organizer,
      location,
    });
    await eventRepository.save(newEvent);
    return newEvent;
  }

  /**
   * Retorna os eventos com filtros opcionais.
   * @param filters Filtros opcionais: date, location e category.
   */
  static async getEvents(filters: { date?: string; location?: string; category?: string } = {}) {
    const eventRepository = AppDataSource.getRepository(Event);
    const where: any = {};
    if (filters.date) where.date = filters.date;
    if (filters.category) where.category = Like(`%${filters.category}%`);
    if (filters.location) where.location = filters.location; // Ajuste conforme necessário para join

    return await eventRepository.find({
      where,
      relations: ['organizer', 'location', 'tickets'],
    });
  }

  /**
   * Retorna um evento pelo identificador.
   * @param id Identificador do evento.
   */
  static async getEventById(id: number) {
    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'location', 'tickets'],
    });
    if (!event) {
      throw new Error('Evento não encontrado.');
    }
    return event;
  }

  /**
   * Atualiza os dados de um evento.
   * @param id Identificador do evento.
   * @param updateData Dados a serem atualizados.
   */
  static async updateEvent(id: number, updateData: Partial<Event>) {
    const eventRepository = AppDataSource.getRepository(Event);
    let event = await eventRepository.findOneBy({ id });
    if (!event) {
      throw new Error('Evento não encontrado.');
    }
    Object.assign(event, updateData);
    event = await eventRepository.save(event);
    return event;
  }

  /**
   * Remove um evento.
   * @param id Identificador do evento.
   */
  static async deleteEvent(id: number) {
    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOneBy({ id });
    if (!event) {
      throw new Error('Evento não encontrado.');
    }
    await eventRepository.remove(event);
  }
}
