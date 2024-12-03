// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDF7wjcp7LRlKrJnbZuFP6CjFJnemV4u9w",
    authDomain: "flare-90f5f.firebaseapp.com",
    projectId: "flare-90f5f",
    storageBucket: "flare-90f5f.firebasestorage.app",
    messagingSenderId: "547624934899",
    appId: "1:547624934899:web:2a439547f5dda2cd79c686",
    measurementId: "G-FYH1K2WVEC"
};
  
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);