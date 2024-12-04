import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Program } from './Program';

@Entity({name: 'sales'})
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' }) 
  seller: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' }) 
  customer: User;

  @Column({nullable: false, type: 'varchar'})
  category: string;

  @Column({nullable: false, type: 'varchar'})
  saleName: string;

  @Column({nullable: false, type: 'varchar'})
  type_voucher: string;

  @Column({nullable: false, type: 'varchar'})
  payment_method: string;

  @Column({nullable: false, type: 'float'})
  amount: number;

  @Column({nullable: false, type: 'float'})
  igv: number;

  @Column({nullable: false, type: 'timestamp'})
  saleDate: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}