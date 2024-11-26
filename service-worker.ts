self.addEventListener('push', async (event: PushEvent) => {
    if (event.data) {
        const eventData = await event.data.json();
        showLocalNotification(eventData.title, eventData.body, self.registration);
    }
});

const showLocalNotification = (title: string, body: string, swRegistration: ServiceWorkerRegistration) => {
    swRegistration.showNotification(title, {
        body,
        icon: '/images/logo_Flare.png',
        badge: '/images/FLARE.png',
    });
};
