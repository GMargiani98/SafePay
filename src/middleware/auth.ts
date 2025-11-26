import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../errors/AppError';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new AppError('Unauthorized: Invalid Token', 401);
  }
}
