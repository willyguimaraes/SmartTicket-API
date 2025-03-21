// src/models/ticket.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Event from './event';  // Importando o modelo Event

class Ticket extends Model {
  public id!: number;
  public eventId!: number;
  public type!: string;
  public price!: number;
  public quantityAvailable!: number;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantityAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Ticket',
  }
);

// Definindo a associação
Ticket.belongsTo(Event, {
  foreignKey: 'eventId',
  onDelete: 'CASCADE',  // Se o evento for deletado, todos os ingressos associados também serão deletados
});

export default Ticket;
