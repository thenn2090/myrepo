import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { CommonActions } from '@react-navigation/native';

const CarDetailsScreen = ({ navigation }) => {
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [fuelCapacity, setFuelCapacity] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const saveCarDetails = async () => {
    // 🚨 Validation Check
    if (!carMake || !carModel || !fuelType || !fuelCapacity || !vehicleNumber) {
      Alert.alert('Error', 'Please fill in all fields before proceeding.');
      return;
    }

    // 🔢 Ensure Fuel Capacity is a valid number
    const fuelCapacityNumber = parseFloat(fuelCapacity);
    if (isNaN(fuelCapacityNumber) || fuelCapacityNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid fuel capacity.');
      return;
    }

    // ✅ Save Data
    const carDetails = {
      carMake,
      carModel,
      fuelType,
      fuelCapacity: fuelCapacityNumber,
      vehicleNumber,
    };

    await AsyncStorage.setItem('carDetails', JSON.stringify(carDetails));

    // 🔄 Navigate to Dashboard
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Car Details</Text>

      {/* Car Make Dropdown */}
      <Text style={styles.label}>Car Make</Text>
      <Picker selectedValue={carMake} onValueChange={setCarMake} style={styles.picker}>
        <Picker.Item label="Select Car Make" value="" />
        <Picker.Item label="Maruti" value="Maruti" />
        <Picker.Item label="Honda" value="Honda" />
        <Picker.Item label="Kia" value="Kia" />
        <Picker.Item label="Hyundai" value="Hyundai" />
      </Picker>

      {/* Car Model */}
      <Text style={styles.label}>Car Model</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Car Model"
        value={carModel}
        onChangeText={setCarModel}
      />

      {/* Fuel Type Dropdown */}
      <Text style={styles.label}>Fuel Type</Text>
      <Picker selectedValue={fuelType} onValueChange={setFuelType} style={styles.picker}>
        <Picker.Item label="Select Fuel Type" value="" />
        <Picker.Item label="Petrol" value="Petrol" />
        <Picker.Item label="Diesel" value="Diesel" />
        <Picker.Item label="Electric" value="Electric" />
        <Picker.Item label="CNG" value="CNG" />
      </Picker>

      {/* Fuel Capacity */}
      <Text style={styles.label}>Fuel Capacity (Liters)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Fuel Capacity"
        keyboardType="numeric"
        value={fuelCapacity}
        onChangeText={setFuelCapacity}
      />

      {/* Vehicle Number */}
      <Text style={styles.label}>Vehicle Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />

      <Button title="Save & Continue" onPress={saveCarDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  picker: { width: '100%', height: 50, marginBottom: 15 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 15 },
});

export default CarDetailsScreen;
