// controllers/locationController.js

/**
 * Location Controller
 * Responsável pelas operações de gerenciamento de locais,
 * incluindo criação, consulta, atualização e remoção.
 */

const locationService = require('../services/locationService');

/**
 * Cria um novo local.
 * Requer: { name, address, capacity, ... }
 */
exports.createLocation = async (req, res) => {
  try {
    const newLocation = await locationService.createLocation(req.body);
    return res.status(201).json(newLocation);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Retorna uma lista de locais.
 */
exports.getLocations = async (req, res) => {
  try {
    const locations = await locationService.getLocations(req.query);
    return res.status(200).json(locations);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Retorna os detalhes de um local específico pelo ID.
 */
exports.getLocationById = async (req, res) => {
  try {
    const locationId = req.params.id;
    const location = await locationService.getLocationById(locationId);
    if (!location) return res.status(404).json({ error: 'Local não encontrado' });
    return res.status(200).json(location);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Atualiza os dados de um local pelo ID.
 */
exports.updateLocation = async (req, res) => {
  try {
    const locationId = req.params.id;
    const updatedLocation = await locationService.updateLocation(locationId, req.body);
    if (!updatedLocation) return res.status(404).json({ error: 'Local não encontrado' });
    return res.status(200).json(updatedLocation);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Remove um local pelo ID.
 */
exports.deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id;
    const deleted = await locationService.deleteLocation(locationId);
    if (!deleted) return res.status(404).json({ error: 'Local não encontrado' });
    return res.status(200).json({ message: 'Local removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
