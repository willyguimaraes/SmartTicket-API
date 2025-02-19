import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user";
import Event from "./event";
import Ticket from "./ticket";

export interface ReservationAttributes {
  id: number;
  quantity: number;
  userId: number;
  eventId: number;
  ticketId: number;
  createdAt?: Date; // Usado como data de reserva (reservedAt)
  updatedAt?: Date;
}

export interface ReservationCreationAttributes extends Optional<ReservationAttributes, "id"> {}

export class Reservation extends Model<ReservationAttributes, ReservationCreationAttributes>
  implements ReservationAttributes {
  public id!: number;
  public quantity!: number;
  public userId!: number;
  public eventId!: number;
  public ticketId!: number;

  // Propriedades associadas opcionais (para que o TypeScript reconheça as relações)
  public ticket?: Ticket;
  public user?: User;
  public event?: Event;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ticket,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "reservations",
    sequelize,
  }
);

export default Reservation;
