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
    console.error("Erro ao criar local:", error);
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
    console.error("Erro ao buscar locais:", error);
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
      res.status(404).json({ message: "Local não encontrado." });
      return;
    }
    res.status(200).json(location);
  } catch (error) {
    console.error("Erro ao buscar local:", error);
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
      res.status(404).json({ message: "Local não encontrado." });
      return;
    }
    location.name = req.body.name || location.name;
    location.address = req.body.address || location.address;
    location.capacity = req.body.capacity || location.capacity;
    await location.save();
    res.status(200).json(location);
  } catch (error) {
    console.error("Erro ao atualizar local:", error);
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
      res.status(404).json({ message: "Local não encontrado." });
      return;
    }
    await location.destroy();
    res.status(200).json({ message: "Local removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover local:", error);
    next(error);
  }
};
