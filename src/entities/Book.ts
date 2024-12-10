import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Program } from './Program';

@Entity({name: 'books'})
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Program, (program) => program.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' }) 
  program: Program;

  @Column({nullable: false, type: 'timestamp'})
  classDate: Date;

  @Column({nullable: false, type: 'varchar'})
  classHour: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_creator_id' }) 
  userCreator: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_booked_id' }) 
  userBooked: User;

  @Column({nullable: true, type: 'varchar'})
  additional_notes: string;

  @Column({nullable: false, type: 'smallint', default: 0})
  deleted: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}


module.exports = {Book}