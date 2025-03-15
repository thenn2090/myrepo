import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FuelBalanceContext } from '../context/FuelBalanceContext';

const FuelInput = () => {
  const { fuelBalance, setFuelBalance, fuelAmountSpent, setFuelAmountSpent } = useContext(FuelBalanceContext);
  const [fuelAmount, setFuelAmount] = useState('');
  const [fuelLiters, setFuelLiters] = useState('');

  const updateFuel = async () => {
    const numericAmount = parseFloat(fuelAmount);
    const numericLiters = parseFloat(fuelLiters);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid fuel amount (₹).');
      return;
    }

    if (isNaN(numericLiters) || numericLiters <= 0) {
      Alert.alert('Invalid Liters', 'Please enter a valid fuel quantity (L).');
      return;
    }

    const newLitersBalance = fuelBalance + numericLiters;
    const newAmountSpent = fuelAmountSpent + numericAmount;

    setFuelBalance(newLitersBalance);
    setFuelAmountSpent(newAmountSpent);

    await AsyncStorage.setItem('fuelBalance', newLitersBalance.toString());
    await AsyncStorage.setItem('fuelAmountSpent', newAmountSpent.toString());

    Alert.alert('Success', `Fuel updated!\nAmount: ₹${numericAmount}, Liters: ${numericLiters}L`);

    setFuelAmount('');
    setFuelLiters('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fuel Amount Spent (₹):</Text>
      <TextInput
        style={styles.input}
        value={fuelAmount}
        onChangeText={setFuelAmount}
        keyboardType="numeric"
        placeholder="Enter amount spent"
      />

      <Text style={styles.label}>Fuel Liters Filled (L):</Text>
      <TextInput
        style={styles.input}
        value={fuelLiters}
        onChangeText={setFuelLiters}
        keyboardType="numeric"
        placeholder="Enter liters filled"
      />

      <Button title="Update Fuel" onPress={updateFuel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default FuelInput;
