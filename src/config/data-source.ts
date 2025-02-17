// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/user';
import { Event } from '../models/event';
import { Ticket } from '../models/ticket';
import { Location } from '../models/location';
import { Reservation } from '../models/reservation';

export const AppDataSource = new DataSource({
  type: 'postgres', // ou outro banco de dados de sua escolha
  host: 'localhost',
  port: 5432,
  username: 'willygmb',
  password: 'willy1234',
  database: 'smartdata',
  synchronize: true,
  logging: false,
  entities: [User, Event, Ticket, Location, Reservation],
  migrations: [],
  subscribers: [],
});
