// services/ticketService.js

/**
 * Ticket Service
 * Responsável por gerenciar a lógica de negócio para a entidade "Ingresso".
 * Interage com o modelo Ticket para criação, consulta, atualização e remoção.
 */

const Ticket = require('../models/Ticket');

/**
 * Cria um novo ingresso.
 * - Recebe os dados do ingresso (event_id, ticket_type, price, total_quantity, etc.).
 */
exports.createTicket = async (ticketData) => {
  const newTicket = await Ticket.create(ticketData);
  return newTicket;
};

/**
 * Retorna uma lista de ingressos.
 * - Suporta filtros, paginação e ordenação conforme parâmetros de query.
 */
exports.getTickets = async (queryParams) => {
  const filter = {};
  const sort = {};
  const { page = 1, limit = 10, sortBy, order } = queryParams;
  if (sortBy) {
    sort[sortBy] = order === 'desc' ? -1 : 1;
  }
  const tickets = await Ticket.find(filter)
    .sort(sort)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));
  return tickets;
};

/**
 * Retorna os detalhes de um ingresso específico pelo ID.
 */
exports.getTicketById = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error("Ingresso não encontrado");
  return ticket;
};

/**
 * Atualiza os dados de um ingresso.
 */
exports.updateTicket = async (ticketId, updateData) => {
  const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true });
  if (!updatedTicket) throw new Error("Ingresso não encontrado");
  return updatedTicket;
};

/**
 * Remove um ingresso pelo ID.
 */
exports.deleteTicket = async (ticketId) => {
  const deleted = await Ticket.findByIdAndDelete(ticketId);
  return !!deleted;
};
