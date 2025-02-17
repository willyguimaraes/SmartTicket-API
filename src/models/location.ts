import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface LocationAttributes {
  id: number;
  name: string;
  address: string;
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LocationCreationAttributes extends Optional<LocationAttributes, "id"> {}

export class Location extends Model<LocationAttributes, LocationCreationAttributes> implements LocationAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public capacity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "locations",
    sequelize,
  }
);

export default Location;
