import webpush from 'web-push';

// Set VAPID details
webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function sendPushNotification(subscription: {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  }
}, data: {
  title: string;
  body: string;
  icon?: string;
}) {
  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      },
    };

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        notification: {
          title: data.title,
          body: data.body,
          icon: data.icon || '/icon-192x192.png',
        },
      })
    );
    console.log(`Push notification sent to ${subscription.endpoint}`);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}
