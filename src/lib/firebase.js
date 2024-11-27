import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDF7wjcp7LRlKrJnbZuFP6CjFJnemV4u9w",
    authDomain: "flare-90f5f.firebaseapp.com",
    projectId: "flare-90f5f",
    storageBucket: "flare-90f5f.firebasestorage.app",
    messagingSenderId: "547624934899",
    appId: "1:547624934899:web:2a439547f5dda2cd79c686",
    measurementId: "G-FYH1K2WVEC"
  };

const app = initializeApp(firebaseConfig);

let messaging;
if (typeof window !== "undefined" && (await isSupported())) {
  messaging = getMessaging(app);
}

export { messaging, getToken, onMessage };