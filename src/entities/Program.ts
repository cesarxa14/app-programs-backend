import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'programs'})
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, type: 'varchar'})
  name: string;

  @Column({nullable: false, type: 'varchar'})
  description: string;

  @Column({nullable: false, type: 'timestamp'})
  startDate: Date;

  @Column({nullable: false, type: 'timestamp'})
  endDate: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}