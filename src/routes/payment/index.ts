import type { FastifyInstance } from 'fastify';
import { depositSchema, transferSchema } from './schemas';
import { depositHandler, transferHandler } from './handler';
import { authenticate } from '../../middleware/auth';

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/deposit', { schema: depositSchema }, depositHandler);

  fastify.post('/transfer', { schema: transferSchema }, transferHandler);
}
