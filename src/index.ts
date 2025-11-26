import 'reflect-metadata';
import fastify from 'fastify';
import { initDB } from './db/db';

import { PaymentService } from './services/payment.service';
import { AppError } from './errors/AppError';

const server = fastify({ logger: true });

await initDB();

const paymentService = new PaymentService();

const depositSchema = {
  body: {
    type: 'object',
    required: ['userId', 'amount'],
    properties: {
      userId: { type: 'number' },
      amount: { type: 'string', pattern: '^[0-9]+$' },
    },
  },
};

server.post('/deposit', { schema: depositSchema }, async (request, reply) => {
  const { userId, amount } = request.body as { userId: number; amount: string };
  const result = await paymentService.deposit(userId, amount);

  return result;
});

server.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({ error: error.message });
  } else {
    server.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

try {
  await server.listen({ port: 3000 });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
