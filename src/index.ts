import 'reflect-metadata';
import jwt from '@fastify/jwt';
import fastify from 'fastify';
import { initDB } from './db/db';
import { AppError } from './errors/AppError';
import paymentRoutes from './routes/payment';
import authRoutes from './routes/auth';

const server = fastify({ logger: true });
server.register(jwt, {
  secret: 'superlongsecret-ideally-fromenvsxd',
});

async function start() {
  try {
    await initDB();
    server.setErrorHandler((error, request, reply) => {
      if (error instanceof AppError) {
        reply.status(error.statusCode).send({ error: error.message });
      } else {
        server.log.error(error);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
    server.register(authRoutes, { prefix: '/auth' });
    server.register(paymentRoutes, { prefix: '/payments' });
    await server.listen({ port: 3000 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
