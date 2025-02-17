import Event, { EventCreationAttributes, EventAttributes } from "../models/event";

/**
 * Repository de Evento.
 * Responsável pelas operações CRUD da entidade Event.
 */
class EventRepository {
  async create(eventData: EventCreationAttributes): Promise<Event> {
    return await Event.create(eventData);
  }

  async findById(id: number): Promise<Event | null> {
    return await Event.findByPk(id, { include: ["organizer", "location", "tickets"] });
  }

  async findAll(): Promise<Event[]> {
    return await Event.findAll({ include: ["organizer", "location", "tickets"] });
  }

  async update(id: number, updateData: Partial<EventAttributes>): Promise<[number, Event[]]> {
    return await Event.update(updateData, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<number> {
    return await Event.destroy({ where: { id } });
  }
}

export default new EventRepository();
