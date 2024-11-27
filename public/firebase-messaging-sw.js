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
      // Push 이벤트의 데이터 파싱
      const payload = event.data.json();
      const notificationTitle = payload.notification?.title || "Default Title";
      const notificationOptions = {
        body: payload.notification?.body || "Default Body",
        icon: '/images/logo_Flare.png', // 기본 아이콘 설정
        image: payload.notification?.image || null, // 추가 이미지 설정
        data: {
          click_action: payload.data?.click_action || "/", // 클릭 액션 URL
        },
      };

      // 알림 표시
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
  // 알림창 닫기
  event.notification.close();

  // 이동할 url
  // 아래의 event.notification.data는 위의 푸시 이벤트를 한 번 거쳐서 전달 받은 options.data에 해당한다. 
  // api에 직접 전달한 데이터와 혼동 주의
  const urlToOpen = event.notification.data.click_action;

  // 클라이언트에 해당 사이트가 열려있는지 체크
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
      
      // 열려있다면 focus, 아니면 새로 open
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});