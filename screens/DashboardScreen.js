import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TollBalanceContext } from '../context/TollBalanceContext';
import { FuelBalanceContext } from '../context/FuelBalanceContext';
import TollTracker from '../Toll/TollTracker';

const DashboardScreen = () => {
  const { totalCharge, setTotalCharge } = useContext(TollBalanceContext);
  const { fuelBalance, setFuelBalance, fuelAmountSpent, setFuelAmountSpent } = useContext(FuelBalanceContext);

  const [carDetails, setCarDetails] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [amount, setAmount] = useState('');
  const [liters, setLiters] = useState('');

  // Fetch car details from AsyncStorage
  useEffect(() => {
    const loadCarDetails = async () => {
      const storedCarDetails = await AsyncStorage.getItem('carDetails');
      if (storedCarDetails) {
        setCarDetails(JSON.parse(storedCarDetails));
      }
    };
    loadCarDetails();
  }, []);

  const handleUpdateBalance = async (type) => {
    const numericAmount = parseFloat(amount);
    const numericLiters = parseFloat(liters);

    if (type === 'toll') {
      if (isNaN(numericAmount) || numericAmount <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid toll amount.');
        return;
      }
      const newBalance = totalCharge + numericAmount;
      setTotalCharge(newBalance);
      await AsyncStorage.setItem('tollBalance', newBalance.toString());
    } 
    
    else if (type === 'fuel') {
      if (isNaN(numericAmount) || numericAmount <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid fuel amount (₹).');
        return;
      }
      if (isNaN(numericLiters) || numericLiters <= 0) {
        Alert.alert('Invalid Liters', 'Please enter a valid fuel quantity (L).');
        return;
      }
      
      const newFuelBalance = fuelBalance + numericLiters;
      const newAmountSpent = fuelAmountSpent + numericAmount;

      setFuelBalance(newFuelBalance);
      setFuelAmountSpent(newAmountSpent);

      await AsyncStorage.setItem('fuelBalance', newFuelBalance.toString());
      await AsyncStorage.setItem('fuelAmountSpent', newAmountSpent.toString());
    }

    setModalType(null);
    setAmount('');
    setLiters('');
  };

  return (
    <View style={styles.container}>
      {/* Car Details Card */}
      {carDetails ? (
        <View style={styles.carDetailsContainer}>
          <Text style={styles.carDetailsTitle}>
            {carDetails.carMake} {carDetails.carModel}
          </Text>
          <Text style={styles.carDetailsText}>Fuel Type: {carDetails.fuelType}</Text>
          <Text style={styles.carDetailsText}>Fuel Capacity: {carDetails.fuelCapacity} L</Text>
          <Text style={styles.carDetailsText}>Vehicle Number: {carDetails.vehicleNumber}</Text>
        </View>
      ) : (
        <Text>Loading Car Details...</Text>
      )}

      {/* Main Dashboard Content */}
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.balanceText}>Toll Balance: ₹{totalCharge}</Text>
      <Text style={styles.balanceText}>Fuel Balance: {fuelBalance} L</Text>
      <Text style={styles.balanceText}>Fuel Amount Spent: ₹{fuelAmountSpent}</Text>
      
      <TollTracker />

      {/* Update Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => setModalType('toll')}>
          <Ionicons name="cash" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} onPress={() => setModalType('fuel')}>
          <Ionicons name="water" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal for Input */}
      {modalType && (
        <Modal transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Enter {modalType === 'toll' ? 'Toll' : 'Fuel'} {modalType === 'toll' ? 'Amount (₹)' : 'Details'}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
              />
              {modalType === 'fuel' && (
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={liters}
                  onChangeText={setLiters}
                  placeholder="Enter fuel liters"
                />
              )}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleUpdateBalance(modalType)}
              >
                <Text style={styles.saveButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalType(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  carDetailsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  carDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  carDetailsText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  balanceText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
  },
  fab: {
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
  },
});

export default DashboardScreen;
