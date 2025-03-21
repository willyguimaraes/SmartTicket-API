import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user";
import Location from "../models/location";

export interface EventAttributes {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  organizerId: number;
  locationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventCreationAttributes extends Optional<EventAttributes, "id"> {}

export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public date!: string;
  public time!: string;
  public category!: string;
  public organizerId!: number;
  public locationId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Location,
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
    tableName: "events",
    sequelize,
  }
);

export default Event;
