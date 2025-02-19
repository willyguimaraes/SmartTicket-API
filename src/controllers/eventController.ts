import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Event } from '../models/event';
import { User } from '../models/user';
import { Location } from '../models/location';
import { Like } from 'typeorm';

/**
 * Cria um novo evento.
 */
export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, date, time, category, organizerId, locationId } = req.body;
    const eventRepository = AppDataSource.getRepository(Event);
    const userRepository = AppDataSource.getRepository(User);
    const locationRepository = AppDataSource.getRepository(Location);

    const organizer = await userRepository.findOneBy({ id: organizerId });
    if (!organizer) {
      res.status(404).json({ message: 'Organizador não encontrado.' });
      return;
    }
    const location = await locationRepository.findOneBy({ id: locationId });
    if (!location) {
      res.status(404).json({ message: 'Local não encontrado.' });
      return;
    }

    const newEvent = eventRepository.create({
      title,
      description,
      date,
      time,
      category,
      organizerId,
      locationId,
    });
    await eventRepository.save(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    next(error);
  }
};

/**
 * Retorna a lista de eventos com filtros (por data, local e categoria).
 */
export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, location, category } = req.query;
    const eventRepository = AppDataSource.getRepository(Event);
    const filters: any = {};
    if (date) filters.date = date;
    if (category) filters.category = Like(`%${category}%`);
    if (location) filters.location = location;

    const events = await eventRepository.find({
      where: filters,
      relations: ['organizer', 'location', 'tickets'],
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    next(error);
  }
};

/**
 * Retorna um evento pelo ID.
 */
export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOne({
      where: { id: Number(id) },
      relations: ['organizer', 'location', 'tickets'],
    });
    if (!event) {
      res.status(404).json({ message: 'Evento não encontrado.' });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    next(error);
  }
};

/**
 * Atualiza os dados de um evento.
 */
export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const eventRepository = AppDataSource.getRepository(Event);
    let event = await eventRepository.findOneBy({ id: Number(id) });
    if (!event) {
      res.status(404).json({ message: 'Evento não encontrado.' });
      return;
    }
    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.category = req.body.category || event.category;
    event = await eventRepository.save(event);
    res.status(200).json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    next(error);
  }
};

/**
 * Remove um evento.
 */
export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOneBy({ id: Number(id) });
    if (!event) {
      res.status(404).json({ message: 'Evento não encontrado.' });
      return;
    }
    await eventRepository.remove(event);
    res.status(200).json({ message: 'Evento removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover evento:', error);
    next(error);
  }
};
