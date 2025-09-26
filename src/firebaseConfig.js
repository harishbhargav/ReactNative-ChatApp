// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2mzYWWyipdAb-gncmQ5zjD7Xf1A5N3nI",
  authDomain: "chatapp-199f0.firebaseapp.com",
  projectId: "chatapp-199f0",
  storageBucket: "chatapp-199f0.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:757784432566:android:56f9cb3c44a13d5048fb17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
