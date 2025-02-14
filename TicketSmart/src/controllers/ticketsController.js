// controllers/ticketController.js

/**
 * Ticket Controller
 * Gerencia as operações relacionadas aos ingressos,
 * como criação, consulta, atualização e remoção.
 */

const ticketService = require('../services/ticketService');

/**
 * Cria um novo ingresso para um evento.
 * Requer: { event_id, ticket_type, price, total_quantity, ... }
 */
exports.createTicket = async (req, res) => {
  try {
    const newTicket = await ticketService.createTicket(req.body);
    return res.status(201).json(newTicket);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Retorna uma lista de ingressos.
 */
exports.getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getTickets(req.query);
    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Retorna os detalhes de um ingresso específico pelo ID.
 */
exports.getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketService.getTicketById(ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ingresso não encontrado' });
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Atualiza os dados de um ingresso pelo ID.
 */
exports.updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const updatedTicket = await ticketService.updateTicket(ticketId, req.body);
    if (!updatedTicket) return res.status(404).json({ error: 'Ingresso não encontrado' });
    return res.status(200).json(updatedTicket);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Remove um ingresso pelo ID.
 */
exports.deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const deleted = await ticketService.deleteTicket(ticketId);
    if (!deleted) return res.status(404).json({ error: 'Ingresso não encontrado' });
    return res.status(200).json({ message: 'Ingresso removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
