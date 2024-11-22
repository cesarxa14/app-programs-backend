// src/entities/Product.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name: 'packages'})
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, type: 'varchar'})
  program: string;

  @Column({nullable: false, type: 'varchar'})
  name: string;

  @Column({nullable: false, type: 'int'})
  num_clases: number;

  @Column({nullable: false, type: 'int'})
  days_validity: number;

  @Column({nullable: false, type: 'float'})
  cost: number;

  @Column({nullable: false, type: 'varchar', default: 'in progress'})
  status: number;
}

module.exports = {Package}
