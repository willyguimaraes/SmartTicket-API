import { Request, Response, NextFunction } from "express";
import Event from "../models/event"; 

// Cria um novo evento
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, date, time, category, organizerId, locationId } = req.body;

    // Verifica se os campos obrigatórios foram enviados
    if (!title || !description || !date || !time || !category || !organizerId || !locationId) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const event = await Event.create({ title, description, date, time, category, organizerId, locationId });
    return res.status(201).json(event);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


// Retorna uma lista de eventos com suporte à paginação
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Exemplo simples de paginação: ?page=1&limit=10
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const events = await Event.findAll({ offset, limit });
    return res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// Retorna os detalhes de um evento específico
export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }
    return res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// Atualiza os dados de um evento existente
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const [updated] = await Event.update(req.body, { where: { id } });
    if (updated === 0) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }
    const updatedEvent = await Event.findByPk(id);
    return res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

// Exclui um evento existente
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await Event.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }
    return res.status(200).json({ message: "Evento excluído com sucesso." });
  } catch (error) {
    next(error);
  }
};
