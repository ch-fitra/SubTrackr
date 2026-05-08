import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { authRoutes } from './modules/auth/auth.routes.js';
import { subscriptionRoutes } from './modules/subscriptions/subscriptions.routes.js';
import { reminderRoutes } from './modules/reminders/reminders.routes.js';
import { analyticsRoutes } from './modules/analytics/analytics.routes.js';
import { paymentRoutes } from './modules/payments/payments.routes.js';
import { setupAuth } from './middleware/auth.js';
import { setupReminderJob } from './jobs/reminderJob.js';
import { setupReminderWorker } from './queues/reminderWorker.js';

const app = Fastify({
  logger: true,
});

// Register plugins
await app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});

await app.register(cookie);

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
});

// Setup auth decorator
setupAuth(app);

// Health check
app.get('/health', async () => ({
  status: 'ok',
}));

// Register routes
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(subscriptionRoutes, { prefix: '/api/subscriptions' });
await app.register(reminderRoutes, { prefix: '/api/reminders' });
await app.register(analyticsRoutes, { prefix: '/api/analytics' });
await app.register(paymentRoutes, { prefix: '/api/payments' });

// Setup background jobs and workers
setupReminderJob();
setupReminderWorker();

const start = async () => {
  try {
    const port = Number(process.env.PORT ?? 3001);
    await app.listen({ port, host: '127.0.0.1' });
    console.log(`Server listening on port ${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
