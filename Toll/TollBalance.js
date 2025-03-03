import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const TollBalance = ({ balance }) => {
  // Format the balance to have commas and two decimal points
  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(balance);

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Current Balance: {formattedBalance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark color for better readability
  },
});

export default TollBalance;
