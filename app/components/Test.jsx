import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { auth } from '../firebase';

export default function App() {
  useEffect(() => {
    console.log("Firebase auth initialized:", auth ? "Yes" : "No");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Firebase connection test</Text>
    </View>
  );
}