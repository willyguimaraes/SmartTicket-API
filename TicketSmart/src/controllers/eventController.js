// controllers/eventController.js

/**
 * Event Controller
 * Responsável por gerenciar os eventos, incluindo criação, consulta,
 * atualização e remoção.
 */

const eventService = require('../services/eventService');

/**
 * Cria um novo evento.
 * Requer: { title, description, event_date, location_id, organizer_id, category, ... }
 */
exports.createEvent = async (req, res) => {
  try {
    const newEvent = await eventService.createEvent(req.body);
    return res.status(201).json(newEvent);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Retorna uma lista de eventos, com suporte a filtros, paginação e ordenação.
 */
exports.getEvents = async (req, res) => {
  try {
    const events = await eventService.getEvents(req.query);
    return res.status(200).json(events);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Retorna os detalhes de um evento específico pelo ID.
 */
exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await eventService.getEventById(eventId);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Atualiza os dados de um evento pelo ID.
 */
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await eventService.updateEvent(eventId, req.body);
    if (!updatedEvent) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Remove um evento pelo ID.
 */
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deleted = await eventService.deleteEvent(eventId);
    if (!deleted) return res.status(404).json({ error: 'Evento não encontrado' });
    return res.status(200).json({ message: 'Evento removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
