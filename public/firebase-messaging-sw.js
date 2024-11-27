// https://firebase.google.com/docs/web/setup#available-libraries
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
);


const firebaseConfig = {
  apiKey: "AIzaSyDF7wjcp7LRlKrJnbZuFP6CjFJnemV4u9w",
  authDomain: "flare-90f5f.firebaseapp.com",
  projectId: "flare-90f5f",
  storageBucket: "flare-90f5f.firebasestorage.app",
  messagingSenderId: "547624934899",
  appId: "1:547624934899:web:2a439547f5dda2cd79c686",
  measurementId: "G-FYH1K2WVEC"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const payload = event.data.json();
      const notificationTitle = payload.title || "New Article released";
      const notificationOptions = {
        body: payload.body || "A new article have been released! Go check it!",
        icon: payload.icon || '/images/logo_Flare.png',
        data: {
          click_action: payload.click_action || "/",
        },
      };

      event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
      );
    } catch (error) {
      console.error("Failed to parse push event data:", error);
    }
  } else {
    console.log("This push event has no data.");
  }
});

self.addEventListener("notificationclick", function (event) {
  event.preventDefault();

  event.notification.close();

  const urlToOpen = event.notification.data.click_action;

  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then(function (windowClients) {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url.includes(urlToOpen)) {
          matchingClient = windowClient;
          break;
        }
      }
      
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});