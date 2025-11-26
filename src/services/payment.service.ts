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

  async transfer(
    fromId: number,
    toId: number,
    amount: string,
    idempotencyKey?: string
  ) {
    if (fromId === toId) {
      throw new AppError('Cannot transfer to self', 400);
    }

    return await AppDataSource.manager.transaction(async (manager) => {
      if (idempotencyKey) {
        const existingTransaction = await manager.findOne(TransactionEntity, {
          where: { idempotency_key: idempotencyKey },
          relations: ['fromUser', 'toUser'],
        });

        if (existingTransaction) {
          return {
            success: true,
            message: 'Request already processed (Idempotent)',
            senderNewBalance: existingTransaction.fromUser.balance,
            receiverNewBalance: existingTransaction.toUser.balance,
          };
        }
      }

      const firstLockId = fromId < toId ? fromId : toId;
      const secondLockId = fromId < toId ? toId : fromId;

      const userOne = await manager.findOne(User, {
        where: { id: firstLockId },
        lock: { mode: 'pessimistic_write' },
      });

      const userTwo = await manager.findOne(User, {
        where: { id: secondLockId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!userOne || !userTwo) {
        throw new AppError('One or more users not found', 404);
      }

      const sender = userOne.id === fromId ? userOne : userTwo;
      const receiver = userOne.id === toId ? userOne : userTwo;

      const transferAmount = BigInt(amount);
      const senderBalance = BigInt(sender.balance);

      if (senderBalance < transferAmount) {
        throw new AppError('Insufficient funds', 400);
      }

      sender.balance = (senderBalance - transferAmount).toString();
      receiver.balance = (BigInt(receiver.balance) + transferAmount).toString();

      await manager.save(sender);
      await manager.save(receiver);

      const transaction = manager.create(TransactionEntity, {
        type: TransactionType.TRANSFER,
        amount: amount,
        fromUser: sender,
        toUser: receiver,
        idempotency_key: idempotencyKey || null,
      });

      await manager.save(transaction);

      return {
        success: true,
        senderNewBalance: sender.balance,
        receiverNewBalance: receiver.balance,
      };
    });
  }
}
