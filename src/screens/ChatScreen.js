import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import useMessages from '../hooks/useMessages';

const ChatScreen = ({ route, user }) => {
  const { roomId, roomName } = route.params;
  const messages = useMessages(roomId);
  const [text, setText] = useState('');
  const [roomData, setRoomData] = useState(null);

  // 🔹 Listen to room data (for members list etc.)
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomId)
      .onSnapshot(doc => setRoomData(doc.data()));

    return () => unsubscribe();
  }, [roomId]);

  // 🔹 Join room automatically if not already joined
  useEffect(() => {
    const joinRoom = async () => {
      const roomRef = firestore().collection('rooms').doc(roomId);
      const roomDoc = await roomRef.get();
      const data = roomDoc.data();
      const alreadyJoined = data?.users?.some(u => u.id === user.id);

      if (!alreadyJoined) {
        await roomRef.update({
          users: firestore.FieldValue.arrayUnion(user),
        });
      }
    };
    if (user) {
      joinRoom();
    }
  }, [roomId, user]);

  // 🔹 Send message
  const handleSend = async () => {
    if (text.trim() === '') return;

    await firestore()
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .add({
        text,
        senderId: user.id,
        senderName: user.name,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

    setText('');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Room title */}
      <Text style={{ fontSize: 18, textAlign: 'center', padding: 10 }}>
        {roomName}
      </Text>

      {/* Members list */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
        {roomData?.users?.map(u => (
          <Text key={u.id} style={{ marginRight: 10, fontWeight: 'bold' }}>
            {u.name}
          </Text>
        ))}
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{item.senderName}: </Text>
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
