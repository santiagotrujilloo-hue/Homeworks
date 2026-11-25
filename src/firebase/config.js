import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBrIja58dn77bkmMlQHYfzthTaul7Z6MVA',
  authDomain: 'cali-delivery-8f122.firebaseapp.com',
  projectId: 'cali-delivery-8f122',
  storageBucket: 'cali-delivery-8f122.firebasestorage.app',
  messagingSenderId: '87250772878',
  appId: '1:87250772878:web:4fa56670f6cdf0743fbadf',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
