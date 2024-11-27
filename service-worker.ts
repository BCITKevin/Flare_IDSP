const swSelf = self as unknown as ServiceWorkerGlobalScope;

swSelf.addEventListener('push', async (event: PushEvent) => {
    if (event.data) {
        const eventData = await event.data.json();

        showLocalNotification(
            eventData.title,
            eventData.body,
            swSelf.registration,
            eventData.url
        );
    }
});

const showLocalNotification = (
    title: string,
    body: string,
    swRegistration: ServiceWorkerRegistration,
    url?: string
) => {
    swRegistration.showNotification(title, {
        body,
        icon: '/images/logo_Flare.png',
        badge: '/images/FLARE.png',
        data: { url },
    });
};

swSelf.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked', event.notification.data);
    event.notification.close();

    const redirectUrl = event.notification.data?.url || '/';

    event.waitUntil(
        swSelf.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === redirectUrl && 'focus' in client) {
                    return client.focus();
                }
            }

            if (swSelf.clients.openWindow) {
                return swSelf.clients.openWindow(redirectUrl);
            }
        })
    );
});
