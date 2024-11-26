import webPush from 'web-push';
import { NextResponse } from 'next/server';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

if (vapidKeys.publicKey !== undefined && vapidKeys.privateKey !== undefined) {
  webPush.setVapidDetails('mailto:flaireidsp@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);
} 

export async function POST(req: Request) {
  const { msg, subscription } = await req.json();

  if (!msg) {
    return NextResponse.json(
      { success: false, error: 'Message is required' },
      { status: 400 }
    );
  }

  const notificationPayload = JSON.stringify({
    title: 'New Notification',
    body: msg || 'Notification',
  });

  await webPush.sendNotification(subscription, notificationPayload)

  return NextResponse.json({ status: 200 });
}