import type { FastifyReply, FastifyRequest } from 'fastify';
import { PaymentService } from '../../services/payment.service';

const paymentService = new PaymentService();

type DepositBody = { userId: number; amount: string };
type TransferBody = { fromUserId: number; toUserId: number; amount: string };

export async function depositHandler(
  request: FastifyRequest<{ Body: DepositBody }>,
  reply: FastifyReply
) {
  const { userId, amount } = request.body;

  const result = await paymentService.deposit(userId, amount);

  return result;
}

export async function transferHandler(
  request: FastifyRequest<{
    Body: TransferBody;
    Headers: { 'x-idempotency-key': string };
  }>,
  reply: FastifyReply
) {
  const { fromUserId, toUserId, amount } = request.body;
  const idempotencyKey = request.headers['x-idempotency-key'];

  const result = await paymentService.transfer(
    fromUserId,
    toUserId,
    amount,
    idempotencyKey
  );
  return result;
}
