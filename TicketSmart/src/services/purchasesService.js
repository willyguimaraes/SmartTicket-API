// services/purchaseService.js

/**
 * Purchase Service
 * Este serviço lida com a lógica de negócio para a entidade "Compra",
 * registrando novas transações e consultando o histórico de compras.
 */

const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket'); // Para validar disponibilidade do ingresso

/**
 * Registra uma nova compra de ingresso.
 * - Recebe os dados da compra (user_id, ticket_id, quantity, total_price, etc.).
 * - Verifica se o ingresso existe e, opcionalmente, se há quantidade disponível.
 * - Cria a compra e atualiza a disponibilidade do ingresso (se aplicável).
 */
exports.createPurchase = async (purchaseData) => {
  // Verifica se o ingresso existe
  const ticket = await Ticket.findById(purchaseData.ticket_id);
  if (!ticket) throw new Error("Ingresso não encontrado");

  // (Opcional) Validar se a quantidade solicitada está disponível
  // Exemplo: if (ticket.total_quantity < purchaseData.quantity) throw new Error("Quantidade insuficiente");

  // Cria a compra
  const newPurchase = await Purchase.create(purchaseData);

  // (Opcional) Atualiza a quantidade disponível do ingresso
  // ticket.total_quantity -= purchaseData.quantity;
  // await ticket.save();

  return newPurchase;
};

/**
 * Retorna uma lista de compras.
 * - Suporta filtros e paginação por meio de query parameters.
 */
exports.getPurchases = async (queryParams) => {
  const filter = {};
  const sort = {};
  const { page = 1, limit = 10, sortBy, order } = queryParams;
  if (sortBy) {
    sort[sortBy] = order === 'desc' ? -1 : 1;
  }
  const purchases = await Purchase.find(filter)
    .sort(sort)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));
  return purchases;
};

/**
 * Retorna os detalhes de uma compra específica pelo ID.
 */
exports.getPurchaseById = async (purchaseId) => {
  const purchase = await Purchase.findById(purchaseId);
  if (!purchase) throw new Error("Compra não encontrada");
  return purchase;
};
