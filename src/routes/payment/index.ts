import type { FastifyInstance } from 'fastify';
import { depositSchema } from './schemas';
import { depositHandler } from './handler';

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.post('/deposit', { schema: depositSchema }, depositHandler);
}
