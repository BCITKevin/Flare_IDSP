interface Data {
    url: string;
}

export default async function sendNotification(cliendId: string, token: string, title: string, body: string, data?: Data) {
    const response = await fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: token,
            title: title,
            body: body,
            data: data,
            cliendId: cliendId
        }),
    });

    const result = await response.json();
    if (result.success) {
        console.log('Notification sent successfully:', result.response);
    } else {
        console.error('Failed to send notification:', result.error);
    }
}

export async function fetchSubscription(id: string, subscription: string) {
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

export async function deleteTokenFromServer(clientId: string, token: string) {
    await fetch("/api/push", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, token }),
    });
}