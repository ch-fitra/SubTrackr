import { Worker } from 'bullmq';
import prisma from '../lib/prisma.js';
import { sendEmailReminder } from '../lib/mailer.js';
import { sendPushNotification } from '../lib/push.js';

export function setupReminderWorker() {
  const worker = new Worker('reminder-notifications', async (job) => {
    const { userId, subscriptionId, reminderId, channel, daysUntilDue, cost, currency, subName } = job.data;

    console.log(`Processing reminder job for ${subName} (User: ${userId})`);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error(`User ${userId} not found`);
      return;
    }

    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!sub) {
      console.error(`Subscription ${subscriptionId} not found`);
      return;
    }

    // Send Email
    if (channel === 'EMAIL' || channel === 'BOTH') {
      await sendEmailReminder(user.email, {
        subName,
        daysUntilDue,
        cost,
        currency,
      });
    }

    // Send Push
    if ((channel === 'PUSH' || channel === 'BOTH') && user.pushEndpoint && user.pushAuth && user.pushP256dh) {
      await sendPushNotification({
        endpoint: user.pushEndpoint,
        keys: {
          auth: user.pushAuth,
          p256dh: user.pushP256dh,
        }
      }, {
        title: `Subscription Reminder: ${subName}`,
        body: `Your subscription is due in ${daysUntilDue} days. Cost: ${currency} ${cost}`,
      });
    }

    // Update lastNotifiedAt
    await prisma.reminder.update({
      where: { id: reminderId },
      data: { lastNotifiedAt: new Date() },
    });

    console.log(`Successfully processed reminder for ${subName}`);
  }, {
    connection: {
      host: process.env.REDIS_URL?.split(':')[1].replace('//', '') || 'localhost',
      port: Number(process.env.REDIS_URL?.split(':')[2]) || 6379,
    }
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });

  return worker;
}
