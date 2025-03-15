import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { TollBalanceContext } from '../context/TollBalanceContext';

const TollAmountInput = () => {
  const { setTotalCharge } = useContext(TollBalanceContext);
  const [amount, setAmount] = useState('');

  const updateTollBalance = () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setTotalCharge((prev) => prev + numericAmount);
    }
  };

  return (
    <View>
      <Text>Enter Toll Amount:</Text>
      <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Button title="Update" onPress={updateTollBalance} />
    </View>
  );
};

export default TollAmountInput;