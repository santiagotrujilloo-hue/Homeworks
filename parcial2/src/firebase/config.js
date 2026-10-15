import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Proyecto de Firebase: parcial2-arbol (cuenta santiago.trujillo_o@uao.edu.co, app web "explorador-web")
const firebaseConfig = {
  apiKey: "AIzaSyBGa-uEuYi_dpGexuTiKG4vxQ_ACxqhg_Q",
  authDomain: "parcial2-arbol-c6f27.firebaseapp.com",
  projectId: "parcial2-arbol-c6f27",
  storageBucket: "parcial2-arbol-c6f27.firebasestorage.app",
  messagingSenderId: "401608491087",
  appId: "1:401608491087:web:068e137fe53a5c953aaa3a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Cloud Firestore
const db = getFirestore(app);

export { app, auth, db };
