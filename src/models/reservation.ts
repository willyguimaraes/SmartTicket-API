// src/models/reservation.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user';
import { Event } from './event';
import { Ticket } from './ticket';

/**
 * Representa uma reserva realizada por um usuário para um evento.
 */
@Entity({ name: 'reservations' })
export class Reservation {
  /** Identificador único da reserva */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Quantidade de ingressos reservados */
  @Column({ type: 'int' })
  quantity!: number;

  /** Data e hora em que a reserva foi efetuada */
  @CreateDateColumn({ type: 'timestamp' })
  reservedAt!: Date;

  /** Data da última atualização da reserva */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  /** Usuário que realizou a reserva */
  @ManyToOne(() => User, (user) => user.reservations)
  user!: User;

  /** Evento para o qual a reserva foi feita */
  @ManyToOne(() => Event, (event) => event.reservations)
  event!: Event;

  /** Tipo de ingresso reservado */
  @ManyToOne(() => Ticket)
  ticket!: Ticket;
}
