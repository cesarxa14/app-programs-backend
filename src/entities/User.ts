// src/entities/Product.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, type: 'varchar'})
  name: string;

  @Column({nullable: false, type: 'varchar'})
  lastname: string;

  @Column({nullable: false, type: 'varchar'})
  password: string;

  @Column({nullable: false, type: 'varchar', unique: true})
  email: string;

  @Column({nullable: false, type: 'int'})
  role: number;

  @Column({nullable: true, type: 'int'})
  phone: number;


  @Column({nullable: true, type: 'varchar'})
  address: string;

  @Column({nullable: true, type: 'varchar'})
  type_document: string;

  @Column({nullable: true, type: 'varchar'})
  document: string;

  @Column({nullable: true, type: 'varchar'})
  birthdate: Date;

  @Column({nullable: true, type: 'varchar'})
  medical_history: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

module.exports = {User}
