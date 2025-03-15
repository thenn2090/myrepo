import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const TollBalance = ({ balance }) => {
  const safeBalance = balance ?? 0; // Ensure balance is not undefined/null

  let formattedBalance;
  try {
    formattedBalance = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Math.max(0, safeBalance));
  } catch (error) {
    formattedBalance = `₹${Number(safeBalance).toFixed(2)}`;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.balanceText, safeBalance < 100 && styles.lowBalance]}>
        Current Balance: {formattedBalance}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  lowBalance: {
    color: 'red',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TollBalance;
