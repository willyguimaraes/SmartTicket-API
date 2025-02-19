import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import Event from "./event";

export interface TicketAttributes {
  id: number;
  type: string;
  price: number;
  quantityAvailable: number;
  eventId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TicketCreationAttributes extends Optional<TicketAttributes, "id"> {}

export class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  
  public id!: number;
  public type!: string;
  public price!: number;
  public quantityAvailable!: number;
  public eventId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantityAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
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
    tableName: "tickets",
    sequelize,
  }
);

export default Ticket;
