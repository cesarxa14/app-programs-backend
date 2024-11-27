// src/entities/Product.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Program } from './Program';

export enum packageStatus {
  HABILITADO = 'HABILITADO',
  DESAHABILITADO = 'DESHABILITADO'
}

@Entity({name: 'packages'})
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Program, (program) => program.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' }) 
  program: Program;

  

  @Column({nullable: false, type: 'varchar'})
  name: string;

  @Column({nullable: true, type: 'varchar'})
  description: string;

  @Column({nullable: false, type: 'int'})
  num_clases: number;

  @Column({nullable: false, type: 'int'})
  expiration: number;

  @Column({nullable: false, type: 'float'})
  cost: number;

  @Column({nullable: false, type: 'varchar', enum: packageStatus, default: packageStatus.HABILITADO})
  status: string;

  @Column({nullable: false, type: 'smallint', default: 0})
  deleted: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}


module.exports = {Package}
