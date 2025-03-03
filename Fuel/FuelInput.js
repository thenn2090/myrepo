// FuelInput.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const FuelInput = ({ onFuelChange }) => {
  const [fuelCapacity, setFuelCapacity] = useState('');
  const [currentFuel, setCurrentFuel] = useState('');

  const handleSave = () => {
    // Check if the inputs are valid numbers and ensure current fuel is not more than fuel capacity
    if (isNaN(fuelCapacity) || isNaN(currentFuel)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for fuel capacity and current fuel.');
      return;
    }

    if (parseFloat(currentFuel) > parseFloat(fuelCapacity)) {
      Alert.alert('Invalid Fuel Level', 'Current fuel cannot be more than the fuel capacity.');
      return;
    }

    // Pass the values back to the parent component using the `onFuelChange` callback
    onFuelChange({
      fuelCapacity: parseFloat(fuelCapacity),
      currentFuel: parseFloat(currentFuel),
    });

    // Optionally, reset the form fields after saving
    setFuelCapacity('');
    setCurrentFuel('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fuel Information</Text>
      <Text style={styles.label}>Fuel Capacity (L):</Text>
      <TextInput
        style={styles.input}
        value={fuelCapacity}
        onChangeText={setFuelCapacity}
        keyboardType="numeric"
        placeholder="Enter fuel capacity"
      />
      <Text style={styles.label}>Current Fuel (L):</Text>
      <TextInput
        style={styles.input}
        value={currentFuel}
        onChangeText={setCurrentFuel}
        keyboardType="numeric"
        placeholder="Enter current fuel"
      />
      <Button title="Save Fuel Info" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default FuelInput;
