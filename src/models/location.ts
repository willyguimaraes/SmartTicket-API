// src/models/location.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Event } from './event';

/**
 * Representa um local onde os eventos são realizados.
 */
@Entity({ name: 'locations' })
export class Location {
  /** Identificador único do local */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Nome do local */
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  /** Endereço completo do local */
  @Column({ type: 'varchar', length: 200 })
  address!: string;

  /** Capacidade máxima do local */
  @Column({ type: 'int' })
  capacity!: number;

  /** Eventos agendados para este local */
  @OneToMany(() => Event, (event) => event.location)
  events!: Event[];

  /** Data de criação do local */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  /** Data da última atualização do local */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
