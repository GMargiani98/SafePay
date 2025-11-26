import type { FastifyInstance } from 'fastify';
import { depositSchema, transferSchema } from './schemas';
import { depositHandler, transferHandler } from './handler';

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.post('/deposit', { schema: depositSchema }, depositHandler);

  fastify.post('/transfer', { schema: transferSchema }, transferHandler);
}
