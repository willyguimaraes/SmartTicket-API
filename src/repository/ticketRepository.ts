import Ticket, { TicketCreationAttributes, TicketAttributes } from "../models/ticket";

/**
 * Repository de Ingresso.
 * Responsável pelas operações CRUD da entidade Ticket.
 */
class TicketRepository {
  async create(ticketData: TicketCreationAttributes): Promise<Ticket> {
    return await Ticket.create(ticketData);
  }

  async findById(id: number): Promise<Ticket | null> {
    return await Ticket.findByPk(id, { include: ["event"] });
  }

  async findAll(): Promise<Ticket[]> {
    return await Ticket.findAll({ include: ["event"] });
  }

  async update(id: number, updateData: Partial<TicketAttributes>): Promise<[number, Ticket[]]> {
    return await Ticket.update(updateData, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<number> {
    return await Ticket.destroy({ where: { id } });
  }
}

export default new TicketRepository();
