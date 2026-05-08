import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../../lib/prisma.js';

const PayStatusEnum = z.enum(['PAID', 'MISSED', 'PENDING']);

const createPaymentSchema = z.object({
  subscriptionId: z.string(),
  amount: z.number().positive(),
  currency: z.string(),
  paidDate: z.string().transform((str) => new Date(str)),
  status: PayStatusEnum.default('PAID'),
  notes: z.string().optional(),
});

export async function paymentRoutes(fastify: FastifyInstance) {
  // Protect all routes
  fastify.addHook('onRequest', fastify.authenticate);

  // List payments
  fastify.get('/', async (request, reply) => {
    const { subscriptionId } = request.query as any;
    const userId = (request.user as any).id;

    const where: any = {};
    
    if (subscriptionId) {
      // Verify ownership of subscription
      const subscription = await prisma.subscription.findFirst({
        where: { id: subscriptionId, userId },
      });

      if (!subscription) {
        return reply.status(404).send({ message: 'Subscription not found' });
      }
      
      where.subscriptionId = subscriptionId;
    } else {
      // If no subscriptionId, return payments for all user's subscriptions
      where.subscription = { userId };
    }

    const payments = await prisma.paymentHistory.findMany({
      where,
      orderBy: { paidDate: 'desc' },
      include: { subscription: true },
    });

    return reply.send(payments);
  });

  // Add manual payment
  fastify.post('/', async (request, reply) => {
    const body = createPaymentSchema.parse(request.body);
    const userId = (request.user as any).id;

    // Verify ownership of subscription
    const subscription = await prisma.subscription.findFirst({
      where: { id: body.subscriptionId, userId },
    });

    if (!subscription) {
      return reply.status(404).send({ message: 'Subscription not found' });
    }

    const payment = await prisma.paymentHistory.create({
      data: body,
    });

    return reply.status(201).send(payment);
  });
}
