
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Program } from './Program';
import { Package } from './Package';
import { Subscription } from './Subscription';


export enum productStatus {
  HABILITADO = 'HABILITADO',
  DESAHABILITADO = 'DESHABILITADO'
}


@Entity({name: 'assists'})
export class Assist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assistant_id' }) 
  assistant: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' }) 
  student: User;

  @ManyToOne(() => Program, (program) => program.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' }) 
  program: Program;

  @ManyToOne(() => Package, (pack) => pack.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' }) 
  package: Package;


  @ManyToOne(() => Subscription, (sub) => sub.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscription_id' }) 
  subscription: Subscription;
  

  @Column({nullable: true, type: 'varchar'})
  classHour: string;

  @Column({nullable: true, type: 'varchar'})
  additional_notes: string;


  @Column({nullable: false, type: 'smallint', default: 0})
  deleted: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}


module.exports = {Assist}