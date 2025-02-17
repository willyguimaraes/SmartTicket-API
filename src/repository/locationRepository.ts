import Location, { LocationCreationAttributes, LocationAttributes } from "../models/location";

/**
 * Repository de Local.
 * Responsável pelas operações CRUD da entidade Location.
 */
class LocationRepository {
  async create(locationData: LocationCreationAttributes): Promise<Location> {
    return await Location.create(locationData);
  }

  async findById(id: number): Promise<Location | null> {
    return await Location.findByPk(id, { include: ["events"] });
  }

  async findAll(): Promise<Location[]> {
    return await Location.findAll({ include: ["events"] });
  }

  async update(id: number, updateData: Partial<LocationAttributes>): Promise<[number, Location[]]> {
    return await Location.update(updateData, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<number> {
    return await Location.destroy({ where: { id } });
  }
}

export default new LocationRepository();
