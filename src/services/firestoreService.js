// src/services/firestoreService.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const fetchRooms = async () => {
  const snapshot = await getDocs(collection(db, 'rooms'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
