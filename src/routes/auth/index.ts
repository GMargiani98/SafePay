import type { FastifyInstance } from 'fastify';
import { registerSchema, loginSchema } from './schemas';
import { registerHandler, loginHandler } from './handler';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { schema: registerSchema }, registerHandler);
  fastify.post('/login', { schema: loginSchema }, loginHandler);
}
