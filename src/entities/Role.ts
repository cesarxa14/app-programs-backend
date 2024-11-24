// src/entities/Product.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'roles'})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, type: 'varchar'})
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}


module.exports = {Role}