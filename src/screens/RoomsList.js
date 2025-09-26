import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const RoomsList = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState('');

  const user = { id: 'user1', name: 'Harish' }; // Logged-in user

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('rooms')
      .onSnapshot(snapshot => {
        const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const createRoom = async () => {
    if (roomName.trim() === '') return;

    const roomRef = await firestore().collection('rooms').add({
      name: roomName,
      users: [user], 
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    setRoomName('');
    navigation.navigate('ChatScreen', { roomId: roomRef.id, roomName, user });
  };


  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="New Room Name"
        value={roomName}
        onChangeText={setRoomName}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 }}
      />
      <Button title="Create Room" onPress={createRoom} />

      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.roomItem}>
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            <Button 
  title="Enter" 
  onPress={() => navigation.navigate('ChatScreen', { roomId: item.id, roomName: item.name, user })} 
/>

          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  roomItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default RoomsList;
