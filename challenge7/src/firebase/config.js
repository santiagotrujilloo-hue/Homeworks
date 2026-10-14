import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Proyecto de Firebase: challenge-07 (cuenta santiago.trujillo_o@uao.edu.co, app web "bitacora-web")
const firebaseConfig = {
  apiKey: "AIzaSyA6nCR6In-zUlGsJhPVhaybaXE_6u_JWKQ",
  authDomain: "challenge-07-a6a12.firebaseapp.com",
  projectId: "challenge-07-a6a12",
  storageBucket: "challenge-07-a6a12.firebasestorage.app",
  messagingSenderId: "420419239801",
  appId: "1:420419239801:web:d2841cfb365d570a24b9a8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Cloud Firestore
const db = getFirestore(app);

const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PEGAR");

export { app, auth, db, isFirebaseConfigured };
