import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity  } from 'react-native';

const TollAmountInput = ({ onBalanceChange }) => {
  const [tollAmount, setTollAmount] = useState('');

  // Function to handle toll amount input and update the balance
  const handleAddToll = () => {
    const parsedAmount = parseInt(tollAmount, 10);
    if (isNaN(parsedAmount)) {
      Alert.alert('Invalid Input', 'Please enter a valid number for the toll amount');
      return;
    }

    onBalanceChange(parsedAmount); // Pass the updated amount to the parent (HomeScreen)
    setTollAmount(''); // Clear the input field
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Toll Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter toll amount"
        keyboardType="numeric"
        value={tollAmount}
        onChangeText={setTollAmount}
      />
      <TouchableOpacity style={styles.addTollButton} onPress={handleAddToll}>
        <Text style={styles.addTollText}>Add Toll</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
});

export default TollAmountInput;
