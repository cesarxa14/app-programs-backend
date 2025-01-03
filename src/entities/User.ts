// src/entities/Product.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

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

  @Column({nullable: true, type: 'varchar'})
  phone: string;

  @Column({nullable: true, type: 'varchar'})
  country: string;

  @Column({nullable: true, type: 'varchar'})
  province: string;

  @Column({nullable: true, type: 'varchar'})
  district: string;


  @Column({nullable: true, type: 'varchar'})
  department: string;

  @Column({nullable: true, type: 'varchar'})
  type_document: string;

  @Column({nullable: true, type: 'varchar'})
  document: string;

  @Column({nullable: true, type: 'varchar'})
  gender: string;

  @Column({nullable: true, type: 'varchar'})
  birthdate: string;

  @Column({nullable: true, type: 'varchar'})
  medical_history: string;

  @Column({nullable: true, type: 'boolean', default: false})
  isVerified: boolean;

  @Column({nullable: false, type: 'smallint', default: -1})
  createdBy: number;

  @Column({nullable: false, type: 'smallint', default: 0})
  deleted: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

module.exports = {User}
