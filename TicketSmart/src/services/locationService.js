// services/locationService.js

/**
 * Location Service
 * Implementa a lógica de negócio para a entidade "Local".
 * Utiliza o modelo Location para interagir com o banco de dados.
 */

const Location = require('../models/Location');

/**
 * Cria um novo local.
 * - Recebe um objeto com os dados do local (name, address, capacity, etc.).
 */
exports.createLocation = async (locationData) => {
  const newLocation = await Location.create(locationData);
  return newLocation;
};

/**
 * Retorna uma lista de locais.
 * - Suporta filtros, paginação e ordenação através dos parâmetros de query.
 */
exports.getLocations = async (queryParams) => {
  const filter = {};
  const sort = {};
  const { page = 1, limit = 10, sortBy, order } = queryParams;
  if (sortBy) {
    sort[sortBy] = order === 'desc' ? -1 : 1;
  }
  const locations = await Location.find(filter)
    .sort(sort)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));
  return locations;
};

/**
 * Retorna os detalhes de um local específico pelo ID.
 */
exports.getLocationById = async (locationId) => {
  const location = await Location.findById(locationId);
  if (!location) throw new Error("Local não encontrado");
  return location;
};

/**
 * Atualiza os dados de um local.
 */
exports.updateLocation = async (locationId, updateData) => {
  const updatedLocation = await Location.findByIdAndUpdate(locationId, updateData, { new: true });
  if (!updatedLocation) throw new Error("Local não encontrado");
  return updatedLocation;
};

/**
 * Remove um local pelo ID.
 */
exports.deleteLocation = async (locationId) => {
  const deleted = await Location.findByIdAndDelete(locationId);
  return !!deleted;
};
