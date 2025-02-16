// src/models/ticket.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Event } from './event';

/**
 * Representa um ingresso disponível para um evento.
 */
@Entity({ name: 'tickets' })
export class Ticket {
  /** Identificador único do ingresso */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Tipo do ingresso (ex.: Standard, VIP) */
  @Column({ type: 'varchar', length: 50 })
  type!: string;

  /** Preço do ingresso */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  /** Quantidade disponível deste ingresso */
  @Column({ type: 'int' })
  quantityAvailable!: number;

  /** Evento associado a este ingresso */
  @ManyToOne(() => Event, (event) => event.tickets)
  event!: Event;

  /** Data de criação do ingresso */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  /** Data da última atualização do ingresso */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
