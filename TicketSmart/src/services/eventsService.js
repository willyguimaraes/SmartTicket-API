// services/eventService.js

/**
 * Event Service
 * Este serviço gerencia a lógica de negócio para a entidade "Evento".
 * Interage com o modelo Event para criação, consulta, atualização e remoção.
 */

const Event = require('../models/Event');

/**
 * Cria um novo evento.
 * - Recebe um objeto com os dados do evento (title, description, event_date, location_id, organizer_id, category, etc.).
 * - Retorna o evento criado.
 */
exports.createEvent = async (eventData) => {
  const newEvent = await Event.create(eventData);
  return newEvent;
};

/**
 * Retorna uma lista de eventos.
 * - Permite a utilização de filtros, paginação e ordenação através dos parâmetros de query.
 */
exports.getEvents = async (queryParams) => {
  // Configura filtros e ordenação (pode ser expandido conforme necessidade)
  const filter = {}; 
  const sort = {};
  const { page = 1, limit = 10, sortBy, order } = queryParams;
  if (sortBy) {
    sort[sortBy] = order === 'desc' ? -1 : 1;
  }
  const events = await Event.find(filter)
    .sort(sort)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));
  return events;
};

/**
 * Retorna os detalhes de um evento específico pelo ID.
 */
exports.getEventById = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Evento não encontrado");
  return event;
};

/**
 * Atualiza os dados de um evento.
 */
exports.updateEvent = async (eventId, updateData) => {
  const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
  if (!updatedEvent) throw new Error("Evento não encontrado");
  return updatedEvent;
};

/**
 * Remove um evento pelo ID.
 */
exports.deleteEvent = async (eventId) => {
  const deleted = await Event.findByIdAndDelete(eventId);
  return !!deleted;
};
