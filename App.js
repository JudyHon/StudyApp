/**
 * COMP4521
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StudyTimer, Progress, Community, Setting } from './Components/Pages';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();

LogBox.ignoreLogs(["`new NativeEventEmitter()` was called with"])

const App = () => {

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Timer" 
          component={StudyTimer} 
          options={{
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="alarm" color={color} size={26} />
            )
          }}
        />
        <Tab.Screen 
          name="Progress" 
          component={Progress}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="check-all" color={color} size={26} />
            )
          }}
        />
        <Tab.Screen 
          name="Community" 
          component={Community}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="forum" color={color} size={26} />
            )
          }}
        />
        <Tab.Screen 
          name="Setting" 
          component={Setting}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="cog-outline" color={color} size={26} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
