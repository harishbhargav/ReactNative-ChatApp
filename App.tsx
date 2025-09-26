import { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoomsList from './src/screens/RoomsList';
import ChatScreen from './src/screens/ChatScreen';
import { fetchRooms } from './src/services/firestoreService';
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const randomId = Date.now().toString();
    setUser({ id: randomId, name: "Guest_" + Math.floor(Math.random() * 1000) });
  }, []);
  if (!user) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoomsList">
      <Stack.Screen name="RoomsList">
        {(props) => <RoomsList {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="ChatScreen">
          {(props) => <ChatScreen {...props} user={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
