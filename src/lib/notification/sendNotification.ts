export default async function sendNotification(msg: string, subscription: PushSubscription) {
    console.log(msg, subscription)
    const noti = await fetch('/api/push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msg, subscription }),
    });

    if (!noti.ok) {
        throw new Error('something wrong..');
    }
}