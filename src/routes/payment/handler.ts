import type { FastifyReply, FastifyRequest } from 'fastify';
import { PaymentService } from '../../services/payment.service';

const paymentService = new PaymentService();

type DepositBody = { amount: string };
type TransferBody = { toUserId: number; amount: string };

export async function depositHandler(
  request: FastifyRequest<{ Body: DepositBody }>,
  reply: FastifyReply
) {
  const userId = request.user.id;
  const { amount } = request.body;

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
  const fromUserId = request.user.id;

  const { toUserId, amount } = request.body;
  const idempotencyKey = request.headers['x-idempotency-key'];

  const result = await paymentService.transfer(
    fromUserId,
    toUserId,
    amount,
    idempotencyKey
  );

  return result;
}
