import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyBs9hQzLSfO-kHaNmpt3G-2NJ5msCUum1A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "z-rendi.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "z-rendi",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "z-rendi.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "324495153278",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:324495153278:web:d2b83413fe49a0bb31202f",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
