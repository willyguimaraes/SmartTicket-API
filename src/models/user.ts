// src/models/user.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Event } from './event';
import { Reservation } from './reservation';



/**
 * Enumeração dos papéis disponíveis para um usuário.
 */
export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  CLIENT = 'client',
}

/**
 * Representa um usuário do sistema.
 */
@Entity({ name: 'users' })
export class User {
  /** Identificador único do usuário */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Nome completo do usuário */
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  /** Endereço de e-mail do usuário (único) */
  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  /** Senha criptografada do usuário */
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  /** Papel do usuário no sistema */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole;

  /** Data de criação do registro */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  /** Data da última atualização do registro */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  /** Eventos organizados pelo usuário */
  @OneToMany(() => Event, (event) => event.organizer)
  events!: Event[];

  /** Reservas efetuadas pelo usuário */
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations!: Reservation[];
}
