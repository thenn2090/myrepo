import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from './DashboardScreen'; // Import Dashboard
import SettingsScreen from './SettingsScreen';  // Example Settings Page

const Drawer = createDrawerNavigator();

const HomeScreen = () => {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default HomeScreen;
