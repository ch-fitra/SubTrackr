import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../../lib/prisma.js';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return reply.status(400).send({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      },
    });

    return reply.status(201).send({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user.id });

    // Set cookie
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token, // Also return token for convenience
    });
  });

  // Me (Protected)
  fastify.get('/me', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: (request.user as any).id },
    });

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    return reply.send(userWithoutPassword);
  });

  // Profile Update (Protected)
  fastify.patch('/profile', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const body = profileSchema.parse(request.body);

    const updatedUser = await prisma.user.update({
      where: { id: (request.user as any).id },
      data: body,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return reply.send(userWithoutPassword);
  });

  // Push Subscribe (Protected)
  fastify.post('/push-subscribe', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const schema = z.object({
      endpoint: z.string(),
      keys: z.object({
        auth: z.string(),
        p256dh: z.string(),
      }),
    });

    const body = schema.parse(request.body);

    await prisma.user.update({
      where: { id: (request.user as any).id },
      data: {
        pushEndpoint: body.endpoint,
        pushAuth: body.keys.auth,
        pushP256dh: body.keys.p256dh,
      },
    });

    return reply.send({ success: true });
  });
}
