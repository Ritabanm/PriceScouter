import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as ScreenOrientation from 'expo-screen-orientation'; // 👈 NEW
import ImagePickerScreen from './screens/ImagePickerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await tf.ready();
        console.log('✅ TensorFlow ready!');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        console.log('📱 Screen locked to portrait mode');
      } catch (error) {
        console.error('❌ Error during app init:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#9b59b6' },
          headerTitleStyle: { color: '#fff' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="PriceScouter"
          component={ImagePickerScreen}
          options={{ title: 'PriceScouter' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
