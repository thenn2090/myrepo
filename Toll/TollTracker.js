import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TollBalance from './TollBalance'; // Import TollBalance component
import { TollBalanceContext } from '../context/TollBalanceContext'; // Import Context

// Coordinates of the toll booths
const tollBooths = [
  { id: 1, name: 'Toll Booth 1', latitude: 12.9607, longitude: 80.2030, charge: 100 },
  { id: 2, name: 'Toll Booth 2', latitude: 12.9616, longitude: 77.6046, charge: 150 },
  { id: 3, name: 'Toll Booth 3', latitude: 12.9506, longitude: 77.6146, charge: 200 },
];

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const TollTracker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const { totalCharge, setTotalCharge } = useContext(TollBalanceContext);
  const [locationPermission, setLocationPermission] = useState(null);
  const [passedTolls, setPassedTolls] = useState(new Set()); // Track passed tolls
  const [watchId, setWatchId] = useState(null);

  // Load Toll Balance from AsyncStorage
  const loadTollBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem('tollBalance');
      if (storedBalance !== null) {
        setTotalCharge(parseInt(storedBalance, 10));
      }
    } catch (error) {
      console.error('Error loading toll balance:', error);
    }
  };

  // Save Toll Balance to AsyncStorage
  const saveTollBalance = async (balance) => {
    try {
      await AsyncStorage.setItem('tollBalance', balance.toString());
    } catch (error) {
      console.error('Error saving toll balance:', error);
    }
  };

  // Request Location Permissions and Start Watching Location
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to track tolls.');
      setLocationPermission(false);
      return;
    }

    setLocationPermission(true);

    // Get last known location (for initial check)
    const lastKnownLocation = await Location.getLastKnownPositionAsync();
    if (lastKnownLocation) {
      setUserLocation(lastKnownLocation.coords);
      checkForTolls(lastKnownLocation.coords);
    }

    // Start location tracking
    const id = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (location) => {
        setUserLocation(location.coords);
        checkForTolls(location.coords);
      }
    );
    setWatchId(id);
  };

  // Function to check if user is near any toll booth
  const checkForTolls = (location) => {
    tollBooths.forEach(async (toll) => {
      const distance = calculateDistance(location.latitude, location.longitude, toll.latitude, toll.longitude);

      if (distance < 2 && !passedTolls.has(toll.id)) {  
        if (totalCharge >= toll.charge) {
          setTotalCharge((prevCharge) => {
            const newBalance = prevCharge - toll.charge;
            saveTollBalance(newBalance); // ✅ Save latest balance
            return newBalance;
          });

          setPassedTolls((prevTolls) => {
            const newSet = new Set(prevTolls);
            newSet.add(toll.id);
            return newSet;
          });

          Alert.alert(`Toll Charge Detected!`, `You passed ${toll.name}. Charge: ₹${toll.charge}`);
        } else {
          Alert.alert('Insufficient Balance', 'You don\'t have enough balance for this toll.');
        }
      }
    });
  };

  // Cleanup function
  useEffect(() => {
    loadTollBalance(); 
    getCurrentLocation();

    // Reset tolls every 10 minutes
    const interval = setInterval(() => setPassedTolls(new Set()), 10 * 60 * 1000);

    return () => {
      clearInterval(interval);
      if (watchId) {
        watchId.remove(); // ✅ Properly stop location tracking
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toll Charge Tracker</Text>

      {userLocation ? (
        <Text style={styles.locationText}>
          Current Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
        </Text>
      ) : locationPermission === null ? (
        <Text style={styles.statusText}>Waiting for location permission...</Text>
      ) : (
        <Text style={styles.statusText}>Permission Denied to access location.</Text>
      )}

      <TollBalance balance={totalCharge} />
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'red',
  },
});

export default TollTracker;