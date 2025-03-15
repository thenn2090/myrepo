import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Storage successfully cleared!');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  useEffect(()=>{
    clearStorage();
  })

  return (
    <View style={styles.container}>
      clear
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SettingsScreen;
