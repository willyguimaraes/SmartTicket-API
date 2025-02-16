// src/models/event.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Location } from './location';
import { Ticket } from './ticket';
import { Reservation } from './reservation';

/**
 * Representa um evento no sistema.
 */
@Entity({ name: 'events' })
export class Event {
  /** Identificador único do evento */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Título do evento */
  @Column({ type: 'varchar', length: 150 })
  title!: string;

  /** Descrição detalhada do evento */
  @Column({ type: 'text' })
  description!: string;

  /** Data de realização do evento */
  @Column({ type: 'date' })
  date!: Date;

  /** Horário do evento */
  @Column({ type: 'time' })
  time!: string;

  /** Categoria do evento */
  @Column({ type: 'varchar', length: 50 })
  category!: string;

  /** Usuário que organizou o evento */
  @ManyToOne(() => User, (user) => user.events)
  organizer!: User;

  /** Local onde o evento será realizado */
  @ManyToOne(() => Location, (location) => location.events)
  location!: Location;

  /** Ingressos disponíveis para o evento */
  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets!: Ticket[];

  /** Reservas efetuadas para o evento */
  @OneToMany(() => Reservation, (reservation) => reservation.event)
  reservations!: Reservation[];

  /** Data de criação do registro do evento */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  /** Data da última atualização do registro do evento */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
