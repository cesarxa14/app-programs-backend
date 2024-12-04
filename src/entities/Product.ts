
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';


export enum productStatus {
  HABILITADO = 'HABILITADO',
  DESAHABILITADO = 'DESHABILITADO'
}


@Entity({name: 'products'})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, type: 'varchar'})
  name: string;

  @Column({nullable: false, type: 'varchar'})
  description: string;

  @Column({nullable: false, type: 'int'})
  quantity: number;

  @Column({nullable: false, type: 'varchar', enum: productStatus, default: productStatus.HABILITADO})
  status: string;

  @Column({nullable: false, type: 'float'})
  price_sale: number;

  @Column({nullable: false, type: 'varchar'})
  image: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}


module.exports = {Product}