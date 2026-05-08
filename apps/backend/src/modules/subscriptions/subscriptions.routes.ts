import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../lib/prisma.js';

const CategoryEnum = z.enum([
  'STREAMING', 'MUSIC', 'SOFTWARE', 'PRODUCTIVITY', 'GAMING', 'CLOUD', 'FITNESS', 'NEWS', 'FINANCE', 'OTHER'
]);

const BillingCycleEnum = z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']);
const StatusEnum = z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']);

const createSubscriptionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: CategoryEnum.default('OTHER'),
  logoUrl: z.string().optional(),
  cost: z.number().positive(),
  currency: z.string().default('IDR'),
  billingCycle: BillingCycleEnum.default('MONTHLY'),
  nextBillingDate: z.string().transform((str) => new Date(str)),
  startDate: z.string().optional().transform((str) => str ? new Date(str) : new Date()),
  status: StatusEnum.default('ACTIVE'),
  website: z.string().optional(),
  notes: z.string().optional(),
  color: z.string().default('#6366f1'),
});

const updateSubscriptionSchema = createSubscriptionSchema.partial();

export async function subscriptionRoutes(fastify: FastifyInstance) {
  // Protect all routes in this plugin
  fastify.addHook('onRequest', fastify.authenticate);

  // List all
  fastify.get('/', async (request, reply) => {
    const { status, category } = request.query as any;
    const userId = (request.user as any).id;

    const where: any = { userId };
    if (status) where.status = status;
    if (category) where.category = category;

    const subscriptions = await prisma.subscription.findMany({
      where,
      orderBy: { nextBillingDate: 'asc' },
    });

    return reply.send(subscriptions);
  });

  // Create
  fastify.post('/', async (request, reply) => {
    const body = createSubscriptionSchema.parse(request.body);
    const userId = (request.user as any).id;

    const subscription = await prisma.subscription.create({
      data: {
        ...body,
        userId,
      },
    });

    return reply.status(201).send(subscription);
  });

  // Get single
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const userId = (request.user as any).id;

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!subscription) {
      return reply.status(404).send({ message: 'Subscription not found' });
    }

    return reply.send(subscription);
  });

  // Update
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const body = updateSubscriptionSchema.parse(request.body);
    const userId = (request.user as any).id;

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!subscription) {
      return reply.status(404).send({ message: 'Subscription not found' });
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: body,
    });

    return reply.send(updated);
  });

  // Delete
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const userId = (request.user as any).id;

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!subscription) {
      return reply.status(404).send({ message: 'Subscription not found' });
    }

    await prisma.subscription.delete({
      where: { id },
    });

    return reply.status(204).send();
  });

  // Mark as paid
  fastify.post('/:id/pay', async (request, reply) => {
    const { id } = request.params as any;
    const userId = (request.user as any).id;

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!subscription) {
      return reply.status(404).send({ message: 'Subscription not found' });
    }

    // Create payment history
    await prisma.paymentHistory.create({
      data: {
        subscriptionId: id,
        amount: subscription.cost,
        currency: subscription.currency,
        paidDate: new Date(),
        status: 'PAID',
      },
    });

    // Auto-advance next billing date
    const nextDate = new Date(subscription.nextBillingDate);
    switch (subscription.billingCycle) {
      case 'WEEKLY':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'MONTHLY':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'YEARLY':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        nextBillingDate: nextDate,
      },
    });

    return reply.send(updated);
  });
}
