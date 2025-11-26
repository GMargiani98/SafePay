import 'reflect-metadata';
import fastify from 'fastify';
import { initDB } from './db/db';
import { AppError } from './errors/AppError';
import paymentRoutes from './routes/payment';

const server = fastify({ logger: true });

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
    server.register(paymentRoutes);
    await server.listen({ port: 3000 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
