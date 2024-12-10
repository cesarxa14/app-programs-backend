import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Entity({name: 'purchases'})
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (prod) => prod.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' }) 
  service: Product;

  @Column({nullable: false, type: 'int'})
  amount: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @Column({nullable: false, type: 'smallint', default: 0})
  deleted: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
} 