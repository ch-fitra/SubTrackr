import { FastifyInstance } from 'fastify';
import prisma from '../../lib/prisma.js';

export async function analyticsRoutes(fastify: FastifyInstance) {
  // Protect all routes
  fastify.addHook('onRequest', fastify.authenticate);

  // Summary
  fastify.get('/summary', async (request, reply) => {
    const userId = (request.user as any).id;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    let totalMonthly = 0;
    let totalYearly = 0;
    const activeCount = subscriptions.length;

    subscriptions.forEach((sub) => {
      const cost = Number(sub.cost);
      switch (sub.billingCycle) {
        case 'WEEKLY':
          totalMonthly += (cost * 52) / 12;
          totalYearly += cost * 52;
          break;
        case 'MONTHLY':
          totalMonthly += cost;
          totalYearly += cost * 12;
          break;
        case 'QUARTERLY':
          totalMonthly += cost / 3;
          totalYearly += cost * 4;
          break;
        case 'YEARLY':
          totalMonthly += cost / 12;
          totalYearly += cost;
          break;
      }
    });

    // Find next payment due
    const nextDue = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { nextBillingDate: 'asc' },
    });

    return reply.send({
      totalMonthly,
      totalYearly,
      activeCount,
      nextPaymentDue: nextDue ? {
        name: nextDue.name,
        date: nextDue.nextBillingDate,
        cost: nextDue.cost,
        currency: nextDue.currency,
      } : null,
    });
  });

  // By Category
  fastify.get('/by-category', async (request, reply) => {
    const userId = (request.user as any).id;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    const categorySpending: Record<string, number> = {};

    subscriptions.forEach((sub) => {
      const cost = Number(sub.cost);
      let monthlyCost = 0;
      switch (sub.billingCycle) {
        case 'WEEKLY': monthlyCost = (cost * 52) / 12; break;
        case 'MONTHLY': monthlyCost = cost; break;
        case 'QUARTERLY': monthlyCost = cost / 3; break;
        case 'YEARLY': monthlyCost = cost / 12; break;
      }

      const category = sub.category || 'OTHER';
      categorySpending[category] = (categorySpending[category] || 0) + monthlyCost;
    });

    return reply.send(categorySpending);
  });

  // Timeline (Last 12 months)
  fastify.get('/timeline', async (request, reply) => {
    const userId = (request.user as any).id;

    // For a simple implementation, let's look at payment history or project monthly costs
    // The prompt says "monthly spending for last 12 months"
    // Let's use PaymentHistory if available, or just project based on active subscriptions
    // Let's use PaymentHistory to show actual spending if it exists.

    const payments = await prisma.paymentHistory.findMany({
      where: {
        subscription: { userId },
        status: 'PAID',
      },
      orderBy: { paidDate: 'desc' },
    });

    const timeline: Record<string, number> = {};
    
    // Initialize last 12 months
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      timeline[monthStr] = 0;
    }

    payments.forEach((pay) => {
      const d = new Date(pay.paidDate);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (timeline.hasOwnProperty(monthStr)) {
        timeline[monthStr] += Number(pay.amount);
      }
    });

    return reply.send(timeline);
  });

  // Upcoming (Next 30 days)
  fastify.get('/upcoming', async (request, reply) => {
    const userId = (request.user as any).id;
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    const upcoming = await prisma.subscription.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        nextBillingDate: {
          gte: now,
          lte: thirtyDaysLater,
        },
      },
      orderBy: { nextBillingDate: 'asc' },
    });

    return reply.send(upcoming);
  });
}
