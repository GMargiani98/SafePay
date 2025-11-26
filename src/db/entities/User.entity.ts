import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // FIX: Explicitly set type: 'varchar' so TypeORM doesn't need to guess
  @Column({ type: 'varchar', unique: true })
  email: string;

  // This one was already safe because we added { type: 'bigint' }
  @Column({ type: 'bigint', default: 0 })
  balance: string;

  @CreateDateColumn()
  createdAt: Date;
}
