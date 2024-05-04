import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  refresh_token: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  create_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
