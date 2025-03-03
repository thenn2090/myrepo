import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TollBalance from './TollBalance'; // Import the new TollBalance component

// Coordinates of the toll booths
const tollBooths = [
  { id: 1, name: 'Toll Booth 1', latitude: 12.9607, longitude: 81.2030, charge: 100 },
  { id: 2, name: 'Toll Booth 2', latitude: 12.9616, longitude: 77.6046, charge: 150 },
  { id: 3, name: 'Toll Booth 3', latitude: 12.9506, longitude: 77.6146, charge: 200 },
];

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const TollTracker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [totalCharge, setTotalCharge] = useState(500); // Default initial balance
  const [locationPermission, setLocationPermission] = useState(false);
  const [passedTolls, setPassedTolls] = useState([]); // Track passed tolls to avoid multiple deductions
  const [watchId, setWatchId] = useState(null); // To store watch ID for cleanup

  // Function to get the current location of the user
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      setLocationPermission(false);
      return;
    }
    setLocationPermission(true);
    const id = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
      (location) => {
        setUserLocation(location.coords);
        checkForTolls(location.coords);
      }
    );
    setWatchId(id); // Store watch ID
  };

  // Function to check if user is near any toll booth
  const checkForTolls = (location) => {
    tollBooths.forEach(toll => {
      const distance = calculateDistance(location.latitude, location.longitude, toll.latitude, toll.longitude);
      if (distance < 2 && !passedTolls.includes(toll.id)) {  // Check if user is within 2 km of a toll booth and hasn't passed it already
        if (totalCharge >= toll.charge) {
          setTotalCharge(prev => prev - toll.charge); // Deduct toll charge from balance
          setPassedTolls(prev => [...prev, toll.id]); // Add toll to passedTolls to prevent multiple deductions
          saveTollBalance(totalCharge - toll.charge); // Save updated balance to AsyncStorage
          Alert.alert(`Toll Charge Detected!`, `You passed ${toll.name}. Charge: ₹${toll.charge}`);
        } else {
          Alert.alert('Insufficient Balance', 'You don\'t have enough balance for this toll.');
        }
      }
    });
  };

  // Function to load toll balance from AsyncStorage
  const loadTollBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem('tollBalance');
      if (storedBalance !== null) {
        setTotalCharge(parseInt(storedBalance, 10)); // Set the balance from AsyncStorage if exists
      }
    } catch (error) {
      console.error('Failed to load toll balance from AsyncStorage:', error);
    }
  };

  // Function to save toll balance to AsyncStorage
  const saveTollBalance = async (balance) => {
    try {
      await AsyncStorage.setItem('tollBalance', balance.toString()); // Save balance to AsyncStorage
    } catch (error) {
      console.error('Failed to save toll balance to AsyncStorage:', error);
    }
  };

  // Cleanup location listener on unmount
  useEffect(() => {
    loadTollBalance(); // Load balance when the component mounts
    getCurrentLocation();

    return () => {
      if (watchId) {
        watchId.remove(); // Correct way to remove the location watch
      }
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Toll Charge Tracker</Text>

      {/* Ensure that userLocation is properly handled */}
      {userLocation ? (
        <Text style={{ marginTop: 20 }}>
          Current Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
        </Text>
      ) : locationPermission === null ? (
        <Text style={{ marginTop: 20 }}>Waiting for location permission...</Text>
      ) : (
        <Text style={{ marginTop: 20 }}>Permission Denied to access location.</Text>
      )}

      <TollBalance balance={totalCharge} /> {/* Display current toll balance */}
    </View>
  );
};

export default TollTracker;
