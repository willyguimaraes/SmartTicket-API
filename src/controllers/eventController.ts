// src/controllers/eventController.ts
import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Event from "../models/event";
import User from "../models/user";
import Location from "../models/location";
import Ticket from "../models/ticket";

/**
 * Cria um novo evento.
 */
export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, date, time, category, organizerId, locationId } = req.body;

    const organizer = await User.findByPk(organizerId);
    if (!organizer) {
      res.status(404).json({ message: "Organizador não encontrado." });
      return;
    }
    const location = await Location.findByPk(locationId);
    if (!location) {
      res.status(404).json({ message: "Local não encontrado." });
      return;
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      category,
      organizerId,
      locationId,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    next(error);
  }
};

/**
 * Retorna a lista de eventos com filtros (por data, local e categoria).
 */
export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, location, category } = req.query;
    const filters: any = {};

    if (date) {
      filters.date = date;
    }
    if (category) {
      filters.category = { [Op.like]: `%${category}%` };
    }
    if (location) {
      // Se a coluna for o ID do local, usamos "locationId"
      filters.locationId = location;
    }

    const events = await Event.findAll({
      where: filters,
      include: [
        { model: User, as: "organizer" },
        { model: Location, as: "location" },
        { model: Ticket, as: "tickets" },
      ],
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    next(error);
  }
};

/**
 * Retorna um evento pelo ID.
 */
export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(Number(id), {
      include: [
        { model: User, as: "organizer" },
        { model: Location, as: "location" },
        { model: Ticket, as: "tickets" },
      ],
    });
    if (!event) {
      res.status(404).json({ message: "Evento não encontrado." });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    next(error);
  }
};

/**
 * Atualiza os dados de um evento.
 */
export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(Number(id));
    if (!event) {
      res.status(404).json({ message: "Evento não encontrado." });
      return;
    }
    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.category = req.body.category || event.category;
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    next(error);
  }
};

/**
 * Remove um evento.
 */
export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(Number(id));
    if (!event) {
      res.status(404).json({ message: "Evento não encontrado." });
      return;
    }
    await event.destroy();
    res.status(200).json({ message: "Evento removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover evento:", error);
    next(error);
  }
};
