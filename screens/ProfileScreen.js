import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://avatars.githubusercontent.com/u/1?v=4', // placeholder avatar
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Your Name</Text>
      <Text style={styles.email}>youremail@example.com</Text>

      <View style={styles.section}>
        <Text style={styles.label}>App Version</Text>
        <Text style={styles.value}>1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Built With</Text>
        <Text style={styles.value}>React Native + Expo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#9b59b6',
  },
  name: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    color: '#bbb',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    color: '#888',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
