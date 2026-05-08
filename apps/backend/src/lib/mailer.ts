import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailReminder(to: string, data: {
  subName: string;
  daysUntilDue: number;
  cost: string;
  currency: string;
}) {
  try {
    await resend.emails.send({
      from: 'Subscription Manager <onboarding@resend.dev>', // Use verified domain in prod
      to,
      subject: `Reminder: Your ${data.subName} subscription is due in ${data.daysUntilDue} days`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Subscription Reminder</h2>
          <p>Hello,</p>
          <p>This is a reminder that your subscription for <strong>${data.subName}</strong> is due in <strong>${data.daysUntilDue}</strong> days.</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Cost:</strong> ${data.currency} ${data.cost}</p>
          </div>
          <p>Log in to the app to manage your subscriptions.</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">If you no longer wish to receive these emails, you can update your settings in the app.</p>
        </div>
      `,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
