// src/controllers/locationController.ts
import { Request, Response, NextFunction } from "express";
import Location from "../models/location";

/**
 * Cria um novo local.
 */
export const createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, address, capacity } = req.body;
    const newLocation = await Location.create({ name, address, capacity });
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ error: 'Dados inválidos' });
    next(error);
  }
};

/**
 * Lista todos os locais.
 */
export const getLocations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar locais.' }); // Alterado para 500, que é mais adequado para erros no servidor
    next(error);
  }
};

/**
 * Retorna um local pelo ID.
 */
export const getLocationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(Number(id));

    if (!location) {
      res.status(404).json({ error: "Local não encontrado." });  // Alterado para 'error' para consistência com os outros testes
      return;
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar local.' }); // Alterado para 500 para erro de servidor
    next(error);
  }
};

/**
 * Atualiza os dados de um local.
 */
export const updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(Number(id));

    if (!location) {
      res.status(404).json({ error: "Local não encontrado." }); // Alterado para 'error'
      return;
    }

    location.name = req.body.name || location.name;
    location.address = req.body.address || location.address;
    location.capacity = req.body.capacity || location.capacity;

    await location.save();
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar local.' }); // Alterado para 500 para erro de servidor
    next(error);
  }
};

/**
 * Remove um local.
 */
export const deleteLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(Number(id));

    if (!location) {
      res.status(404).json({ error: "Local não encontrado." }); // Alterado para 'error'
      return;
    }

    await location.destroy();
    res.status(200).json({ message: "Local removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover local.' }); // Alterado para 500 para erro de servidor
    next(error);
  }
};
