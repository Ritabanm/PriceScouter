import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ImagePickerScreen from '../screens/ImagePickerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#9b59b6' },
        headerTitleStyle: { color: '#fff' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        tabBarStyle: { backgroundColor: '#1e1e1e' },
        tabBarActiveTintColor: '#9b59b6',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Home' ? 'home' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={ImagePickerScreen}
        options={{ title: 'PriceScouter' }} // Custom App Bar title
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
