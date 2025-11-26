import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppDataSource } from '../../db/db';
import { User } from '../../db/entities/User.entity';
import { AppError } from '../../errors/AppError';
import bcrypt from 'bcryptjs';

const userRepository = AppDataSource.getRepository(User);

type AuthBody = { email: string; password: string };

export async function registerHandler(
  request: FastifyRequest<{ Body: AuthBody }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const existing = await userRepository.findOneBy({ email });
  if (existing) throw new AppError('Email already in use', 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = userRepository.create({
    email,
    password: hashedPassword,
    balance: '0',
  });

  await userRepository.save(user);

  return { id: user.id, email: user.email };
}

export async function loginHandler(
  request: FastifyRequest<{ Body: AuthBody }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const user = await userRepository.findOne({
    where: { email },
    select: ['id', 'email', 'password'],
  });

  if (!user) throw new AppError('Invalid email or password', 401);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new AppError('Invalid email or password', 401);

  const token = request.server.jwt.sign({ id: user.id, email: user.email });

  return { token };
}
