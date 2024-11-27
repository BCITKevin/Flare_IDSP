interface PushSubscription {
    endpoint: string;
    expirationTime: number | null;
    keys?: {
        p256dh: string | null;
        auth: string | null;
    };
}

export default async function sendNotification(msg: string, subscription: PushSubscription, url: string) {
    const noti = await fetch('/api/push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msg, subscription, url }),
    });

    if (!noti.ok) {
        throw new Error('something wrong..');
    }
}

export async function fetchSubscription(id: string, subscription: PushSubscription) {
    const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clientId: id,
            subscription: subscription,
        }),
    });

    const data = await res.json();

    if (data.ok) {
        return true;
    } else {
        return data.error;
    }
}