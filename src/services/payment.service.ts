import { AppDataSource } from '../db/db';
import {
  TransactionType,
  Transaction as TransactionEntity,
} from '../db/entities/Transaction.entity';
import { User } from '../db/entities/User.entity';
import { AppError } from '../errors/AppError';

export class PaymentService {
  async deposit(userId: number, amount: string) {
    return await AppDataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) throw new AppError('User not found', 404);

      const currentBalance = BigInt(user.balance);
      const depositAmount = BigInt(amount);

      user.balance = (currentBalance + depositAmount).toString();

      await manager.save(user);

      const transaction = manager.create(TransactionEntity, {
        type: TransactionType.DEPOSIT,
        amount,
        toUser: user,
      });

      await manager.save(transaction);
      return { success: true, newBalance: user.balance };
    });
  }
}
