import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import TollAmountInput from '../Toll/AddTollBalance';

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TollAmountInput />
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
