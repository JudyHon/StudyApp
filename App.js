/**
 * COMP4521
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StudyTimer, Progress, Community, Setting } from './Components/Pages';
import { NavigationContainer } from '@react-navigation/native';
import Notifications from './Components/Notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialBottomTabNavigator();

LogBox.ignoreLogs(["`new NativeEventEmitter()` was called with"])

const App = () => {

  useEffect(()=>{
    (async function getData() {
      try {
          const value = await AsyncStorage.getItem('@StudyApp:isSetNotification');
          if (!value) {
            Notifications.scheduleNotification();
            await AsyncStorage.setItem('@StudyApp:isSetNotification', "true")
          }
      } catch {}
    })()
  }, [])

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
