import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyD-c1dKmv5-BK0ziVqThBEuiwaNqY5JLQA",
  authDomain: "social-media-app-c19d3.firebaseapp.com",
  projectId: "social-media-app-c19d3",
  storageBucket: "social-media-app-c19d3.firebasestorage.app",
  messagingSenderId: "1070334167249",
  appId: "1:1070334167249:web:6e2c78ee8cbe5219b85df0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);