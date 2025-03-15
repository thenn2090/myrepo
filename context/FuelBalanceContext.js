import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FuelBalanceContext = createContext();

export const FuelBalanceProvider = ({ children }) => {
  const [fuelBalance, setFuelBalance] = useState(0); // Liters
  const [fuelAmountSpent, setFuelAmountSpent] = useState(0); // Amount in ₹
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadFuelData = async () => {
      const storedLiters = await AsyncStorage.getItem('fuelBalance');
      const storedAmount = await AsyncStorage.getItem('fuelAmountSpent');

      if (storedLiters) setFuelBalance(parseFloat(storedLiters));
      if (storedAmount) setFuelAmountSpent(parseFloat(storedAmount));

      setIsInitialized(true);
    };
    loadFuelData();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      AsyncStorage.setItem('fuelBalance', fuelBalance.toString());
      AsyncStorage.setItem('fuelAmountSpent', fuelAmountSpent.toString());
    }
  }, [fuelBalance, fuelAmountSpent, isInitialized]);

  return (
    <FuelBalanceContext.Provider value={{ fuelBalance, setFuelBalance, fuelAmountSpent, setFuelAmountSpent }}>
      {children}
    </FuelBalanceContext.Provider>
  );
};
