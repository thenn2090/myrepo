import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button, ActivityIndicator } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';
import SettingsScreen from './screens/SettingsScreen';
import DashboardScreen from './screens/DashboardScreen';

import { TollBalanceProvider } from './context/TollBalanceContext';
import { FuelBalanceProvider } from './context/FuelBalanceContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const LogoutScreen = ({ navigation }) => {
  const handleLogout = async () => {
    // Clear all AsyncStorage data
    await AsyncStorage.clear();

    // Optionally, you can also clear specific items like 'fuelBalance' and 'fuelAmountSpent' explicitly
    await AsyncStorage.removeItem('fuelBalance');
    await AsyncStorage.removeItem('fuelAmountSpent');
    await AsyncStorage.removeItem('tollBalance');
    
    // Reset the navigation stack and redirect to the CarDetailsScreen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'CarDetails' }],
      })
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Are you sure you want to logout?</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
    <Drawer.Screen name="Logout" component={LogoutScreen} />
  </Drawer.Navigator>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCarDetailsSet, setIsCarDetailsSet] = useState(false);

  useEffect(() => {
    const checkCarDetails = async () => {
      const carDetails = await AsyncStorage.getItem('carDetails');
      setIsCarDetailsSet(!!carDetails);
      setIsLoading(false);
    };
    checkCarDetails();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <TollBalanceProvider>
      <FuelBalanceProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* ✅ CarDetailsScreen should always be part of the Stack */}
            <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
            <Stack.Screen name="MainApp" component={DrawerNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </FuelBalanceProvider>
    </TollBalanceProvider>
  );
}
