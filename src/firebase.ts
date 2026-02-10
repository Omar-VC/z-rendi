// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de Firebase (tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyBs9hQzLSfO-kHaNmpt3G-2NJ5msCUum1A",
  authDomain: "z-rendi.firebaseapp.com",
  projectId: "z-rendi",
  storageBucket: "z-rendi.firebasestorage.app",
  messagingSenderId: "324495153278",
  appId: "1:324495153278:web:d2b83413fe49a0bb31202f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
