// src/services/locationService.ts
import { AppDataSource } from '../config/data-source';
import { Location } from '../models/location';

export class LocationService {
  /**
   * Cria um novo local.
   * @param name Nome do local.
   * @param address Endereço do local.
   * @param capacity Capacidade do local.
   */
  static async createLocation(name: string, address: string, capacity: number) {
    const locationRepository = AppDataSource.getRepository(Location);
    const newLocation = locationRepository.create({ name, address, capacity });
    await locationRepository.save(newLocation);
    return newLocation;
  }

  /**
   * Retorna todos os locais.
   */
  static async getLocations() {
    const locationRepository = AppDataSource.getRepository(Location);
    return await locationRepository.find();
  }

  /**
   * Retorna um local pelo identificador.
   * @param id Identificador do local.
   */
  static async getLocationById(id: number) {
    const locationRepository = AppDataSource.getRepository(Location);
    const location = await locationRepository.findOneBy({ id });
    if (!location) {
      throw new Error('Local não encontrado.');
    }
    return location;
  }

  /**
   * Atualiza os dados de um local.
   * @param id Identificador do local.
   * @param updateData Dados a serem atualizados.
   */
  static async updateLocation(id: number, updateData: Partial<Location>) {
    const locationRepository = AppDataSource.getRepository(Location);
    let location = await locationRepository.findOneBy({ id });
    if (!location) {
      throw new Error('Local não encontrado.');
    }
    Object.assign(location, updateData);
    location = await locationRepository.save(location);
    return location;
  }

  /**
   * Remove um local.
   * @param id Identificador do local.
   */
  static async deleteLocation(id: number) {
    const locationRepository = AppDataSource.getRepository(Location);
    const location = await locationRepository.findOneBy({ id });
    if (!location) {
      throw new Error('Local não encontrado.');
    }
    await locationRepository.remove(location);
  }
}
