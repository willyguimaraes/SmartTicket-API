import Reservation, { ReservationCreationAttributes, ReservationAttributes } from "../models/reservation";

/**
 * Repository de Reserva.
 * Responsável pelas operações CRUD da entidade Reservation.
 */
class ReservationRepository {
  async create(reservationData: ReservationCreationAttributes): Promise<Reservation> {
    return await Reservation.create(reservationData);
  }

  async findById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id, { include: ["user", "event", "ticket"] });
  }

  async findAll(): Promise<Reservation[]> {
    return await Reservation.findAll({ include: ["user", "event", "ticket"] });
  }

  async update(id: number, updateData: Partial<ReservationAttributes>): Promise<[number, Reservation[]]> {
    return await Reservation.update(updateData, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<number> {
    return await Reservation.destroy({ where: { id } });
  }
}

export default new ReservationRepository();
