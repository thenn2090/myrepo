import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Icon library
import FuelInput from '../Fuel/FuelInput';  // FuelInput component
import TollAmountInput from '../Toll/AddTollBalance';  // TollAmountInput component
import TollTracker from '../Toll/TollTracker';

const HomeScreen = () => {
  const [fuelInfo, setFuelInfo] = useState({ fuelCapacity: 0, currentFuel: 0 });
  const [totalCharge, setTotalCharge] = useState(500); // Default initial balance for toll
  const [fuelModalVisible, setFuelModalVisible] = useState(false); // State for Fuel Modal visibility
  const [tollModalVisible, setTollModalVisible] = useState(false); // State for Toll Modal visibility

  // Handles fuel data change from FuelInput component
  const handleFuelChange = (fuelData) => {
    setFuelInfo(fuelData); // Updates the fuel information
    setFuelModalVisible(false); // Closes the fuel modal
  };

  // Handles toll balance change from TollAmountInput component
  const handleTollAmountChange = (amount) => {
    setTotalCharge((prev) => prev + amount); // Adds the toll amount to the balance
    setTollModalVisible(false); // Closes the toll modal
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to the Toll and Fuel Tracker</Text>

      {/* Display fuel and toll balance information */}
      <View style={styles.infoContainer}>
        <Text style={styles.detail}>Fuel Capacity: {fuelInfo.fuelCapacity} L</Text>
        <Text style={styles.detail}>Current Fuel: {fuelInfo.currentFuel} L</Text>
        <Text style={styles.detail}>Toll Balance: ₹{totalCharge}</Text>
      </View>
      <TollTracker />

      {/* Fuel Icon (green) to open the fuel modal */}
      <Icon
        name="tint"
        size={40}
        color="green"
        style={[styles.icon, { bottom: 150 }]} // Positioned towards the bottom for fuel
        onPress={() => setFuelModalVisible(true)}  // Opens the Fuel Modal
      />

      {/* Toll Icon (blue) to open the toll modal */}
      <Icon
        name="credit-card"
        size={40}
        color="blue"
        style={styles.icon} // Positioned at the bottom for toll
        onPress={() => setTollModalVisible(true)}  // Opens the Toll Modal
      />

      {/* Modal for Fuel Information */}
      <Modal
        visible={fuelModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFuelModalVisible(false)}  // Close modal when back pressed
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Fuel Information</Text>
            <FuelInput onFuelChange={handleFuelChange} />  {/* Fuel input component */}
            <Button title="Close" onPress={() => setFuelModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal for Toll Amount */}
      <Modal
        visible={tollModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTollModalVisible(false)}  // Close modal when back pressed
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Toll Amount</Text>
            <TollAmountInput onBalanceChange={handleTollAmountChange} />  {/* Toll amount input component */}
            <Button title="Close" onPress={() => setTollModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    fontSize: 24,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  icon: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default HomeScreen;
