import { DataSource } from 'typeorm';
import { User } from './entities/User.entity';
import { Transaction } from './entities/Transaction.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password123',
  database: 'safepay',
  synchronize: true,
  logging: true,
  entities: [User, Transaction],
});

export const initDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('🔥 Database connected & Synchronized!');
  } catch (err) {
    console.error('Error connecting to DB:', err);
    process.exit(1);
  }
};
