import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Package } from './Package';
import { Sale } from './Sale';

@Entity({name: 'subscriptions'})
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Package, (pack) => pack.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' }) 
  service: Package;

  @Column({nullable: false, type: 'timestamp'})
  startDate: Date;

  @Column({nullable: false, type: 'timestamp'})
  endDate: Date;

  @Column({nullable: false, type: 'boolean', default: true})
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @ManyToOne(() => Sale, (sale) => sale.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' }) 
  sale: Sale;

  @Column({nullable: false, type: 'smallint', default: 0})
  deleted: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
} 