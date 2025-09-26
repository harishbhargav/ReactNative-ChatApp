import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

const useMessages = (roomId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [roomId]);

  return messages;
};

export default useMessages;
