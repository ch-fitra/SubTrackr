import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../lib/prisma.js';

const ChannelEnum = z.enum(['EMAIL', 'PUSH', 'BOTH']);

const createReminderSchema = z.object({
  subscriptionId: z.string(),
  daysBefore: z.number().int().positive().default(3),
  channel: ChannelEnum.default('EMAIL'),
  isActive: z.boolean().default(true),
});

const updateReminderSchema = createReminderSchema.partial();

export async function reminderRoutes(fastify: FastifyInstance) {
  // Protect all routes
  fastify.addHook('onRequest', fastify.authenticate);

  // List reminders for a subscription
  fastify.get('/:subscriptionId', async (request, reply) => {
    const { subscriptionId } = request.params as any;
    const userId = (request.user as any).id;

    // Verify ownership of subscription
    const subscription = await prisma.subscription.findFirst({
      where: { id: subscriptionId, userId },
    });

    if (!subscription) {
      return reply.status(404).send({ message: 'Subscription not found' });
    }

    const reminders = await prisma.reminder.findMany({
      where: { subscriptionId },
    });

    return reply.send(reminders);
  });

  // Create reminder
  fastify.post('/', async (request, reply) => {
    const body = createReminderSchema.parse(request.body);
    const userId = (request.user as any).id;

    // Verify ownership of subscription
    const subscription = await prisma.subscription.findFirst({
      where: { id: body.subscriptionId, userId },
    });

    if (!subscription) {
      return reply.status(404).send({ message: 'Subscription not found' });
    }

    const reminder = await prisma.reminder.create({
      data: body,
    });

    return reply.status(201).send(reminder);
  });

  // Update reminder
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const body = updateReminderSchema.parse(request.body);
    const userId = (request.user as any).id;

    // Find reminder and verify ownership via subscription
    const reminder = await prisma.reminder.findUnique({
      where: { id },
      include: { subscription: true },
    });

    if (!reminder || reminder.subscription.userId !== userId) {
      return reply.status(404).send({ message: 'Reminder not found' });
    }

    const updated = await prisma.reminder.update({
      where: { id },
      data: body,
    });

    return reply.send(updated);
  });

  // Delete reminder
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const userId = (request.user as any).id;

    // Find reminder and verify ownership via subscription
    const reminder = await prisma.reminder.findUnique({
      where: { id },
      include: { subscription: true },
    });

    if (!reminder || reminder.subscription.userId !== userId) {
      return reply.status(404).send({ message: 'Reminder not found' });
    }

    await prisma.reminder.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}
