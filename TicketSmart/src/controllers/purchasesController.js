// controllers/purchaseController.js

/**
 * Purchase Controller
 * Responsável por gerenciar as transações de compra de ingressos,
 * registrando novas compras e consultando o histórico de transações.
 */

const purchaseService = require('../services/purchaseService');

/**
 * Registra uma nova compra de ingressos.
 * Requer: { user_id, ticket_id, quantity, total_price, ... }
 */
exports.createPurchase = async (req, res) => {
  try {
    const newPurchase = await purchaseService.createPurchase(req.body);
    return res.status(201).json(newPurchase);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Retorna uma lista de compras realizadas.
 * Pode utilizar filtros e paginação via parâmetros de query.
 */
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await purchaseService.getPurchases(req.query);
    return res.status(200).json(purchases);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Retorna os detalhes de uma compra específica pelo ID.
 */
exports.getPurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const purchase = await purchaseService.getPurchaseById(purchaseId);
    if (!purchase) return res.status(404).json({ error: 'Compra não encontrada' });
    return res.status(200).json(purchase);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
