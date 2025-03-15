import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TollBalanceContext = createContext();

export const TollBalanceProvider = ({ children }) => {
  const [totalCharge, setTotalCharge] = useState(500);

  useEffect(() => {
    const loadBalance = async () => {
      const storedBalance = await AsyncStorage.getItem('tollBalance');
      if (storedBalance) setTotalCharge(parseInt(storedBalance, 10));
    };
    loadBalance();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tollBalance', totalCharge.toString());
  }, [totalCharge]);

  return (
    <TollBalanceContext.Provider value={{ totalCharge, setTotalCharge }}>
      {children}
    </TollBalanceContext.Provider>
  );
};