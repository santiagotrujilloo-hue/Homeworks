import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Pegar aquí el objeto que entrega Firebase al registrar la app web
// (Configuración del proyecto → General → Tus apps → SDK setup and configuration)
const firebaseConfig = {
  apiKey: "PEGAR_API_KEY",
  authDomain: "PEGAR_AUTH_DOMAIN",
  projectId: "PEGAR_PROJECT_ID",
  storageBucket: "PEGAR_STORAGE_BUCKET",
  messagingSenderId: "PEGAR_MESSAGING_SENDER_ID",
  appId: "PEGAR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Cloud Firestore
const db = getFirestore(app);

const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PEGAR");

export { app, auth, db, isFirebaseConfigured };
