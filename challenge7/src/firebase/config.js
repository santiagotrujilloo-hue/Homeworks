import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Proyecto de Firebase: tareas-challenge7 (app web "tareas-web")
const firebaseConfig = {
  apiKey: "AIzaSyB-OTHnV0ScZtj5O4KA6gfx21oROTDlGYY",
  authDomain: "tareas-challenge7.firebaseapp.com",
  projectId: "tareas-challenge7",
  storageBucket: "tareas-challenge7.firebasestorage.app",
  messagingSenderId: "518472371468",
  appId: "1:518472371468:web:cbf29d2156039d5db90d29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Cloud Firestore
const db = getFirestore(app);

const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PEGAR");

export { app, auth, db, isFirebaseConfigured };
