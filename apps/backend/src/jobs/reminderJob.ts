import cron from 'node-cron';
import { Queue } from 'bullmq';
import prisma from '../lib/prisma.js';

// Initialize BullMQ queue
const reminderQueue = new Queue('reminder-notifications', {
  connection: {
    host: process.env.REDIS_URL?.split(':')[1].replace('//', '') || 'localhost',
    port: Number(process.env.REDIS_URL?.split(':')[2]) || 6379,
  }
});

export function setupReminderJob() {
  // Runs every day at 07:00 (Server time)
  // To handle user timezone properly, you would need to run this more frequently
  // and check user.timezone, but for now we run once a day.
  cron.schedule('0 7 * * *', async () => {
    console.log('Running daily reminder check...');
    
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Find all active subscriptions with next billing date in the next 7 days
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        nextBillingDate: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      include: {
        reminders: true,
        user: true,
      },
    });

    for (const sub of subscriptions) {
      for (const reminder of sub.reminders) {
        if (!reminder.isActive) continue;

        const nextBilling = new Date(sub.nextBillingDate);
        const diffTime = nextBilling.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Check if this reminder matches the daysBefore setting
        if (diffDays === reminder.daysBefore) {
          // Check if already notified today
          const todayStr = now.toISOString().split('T')[0];
          const lastNotifiedStr = reminder.lastNotifiedAt?.toISOString().split('T')[0];

          if (todayStr === lastNotifiedStr) {
            continue; // Skip if already notified today
          }

          // Push job to queue
          await reminderQueue.add('send-reminder', {
            userId: sub.userId,
            subscriptionId: sub.id,
            reminderId: reminder.id,
            channel: reminder.channel,
            daysUntilDue: diffDays,
            cost: sub.cost,
            currency: sub.currency,
            subName: sub.name,
          });

          console.log(`Queued reminder for ${sub.name} to user ${sub.userId}`);
        }
      }
    }
  });
}
