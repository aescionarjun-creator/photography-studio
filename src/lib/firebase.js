// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDPUZtxxQFIqK97xKSksUdenhntMA3hWdo",
  authDomain: "photography-studio-c878e.firebaseapp.com",
  projectId: "photography-studio-c878e",
  storageBucket: "photography-studio-c878e.firebasestorage.app",
  messagingSenderId: "762319742506",
  appId: "1:762319742506:web:a3e7e253ee0be899a8c553",
  measurementId: "G-08BMR29824",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (safely works across all browsers & SSR)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
