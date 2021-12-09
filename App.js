/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Homepage, Progress, Community, Setting } from './Components';

import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Timer" 
          component={Homepage} 
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

const styles = StyleSheet.create({

});

export default App;
