// src/controllers/locationController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Location } from '../models/location';

/**
 * Cria um novo local.
 */
export const createLocation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, address, capacity } = req.body;
    const locationRepository = AppDataSource.getRepository(Location);
    const newLocation = locationRepository.create({ name, address, capacity });
    await locationRepository.save(newLocation);
    return res.status(201).json(newLocation);
  } catch (error) {
    console.error('Erro ao criar local:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Lista todos os locais.
 */
export const getLocations = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const locationRepository = AppDataSource.getRepository(Location);
    const locations = await locationRepository.find();
    return res.status(200).json(locations);
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Retorna um local pelo ID.
 */
export const getLocationById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const locationRepository = AppDataSource.getRepository(Location);
    const location = await locationRepository.findOneBy({ id: Number(id) });
    if (!location) {
      return res.status(404).json({ message: 'Local não encontrado.' });
    }
    return res.status(200).json(location);
  } catch (error) {
    console.error('Erro ao buscar local:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Atualiza os dados de um local.
 */
export const updateLocation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const locationRepository = AppDataSource.getRepository(Location);
    let location = await locationRepository.findOneBy({ id: Number(id) });
    if (!location) {
      return res.status(404).json({ message: 'Local não encontrado.' });
    }
    location.name = req.body.name || location.name;
    location.address = req.body.address || location.address;
    location.capacity = req.body.capacity || location.capacity;
    location = await locationRepository.save(location);
    return res.status(200).json(location);
  } catch (error) {
    console.error('Erro ao atualizar local:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Remove um local.
 */
export const deleteLocation = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const locationRepository = AppDataSource.getRepository(Location);
    const location = await locationRepository.findOneBy({ id: Number(id) });
    if (!location) {
      return res.status(404).json({ message: 'Local não encontrado.' });
    }
    await locationRepository.remove(location);
    return res.status(200).json({ message: 'Local removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover local:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
