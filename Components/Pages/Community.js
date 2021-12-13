/**
 * COMP4521
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainPage, Signup, Login } from './communityPage';

const Stack = createNativeStackNavigator();

const Community = () => {
  return (
    <Stack.Navigator    
      screenOptions={{
        headerShown:false
      }}
    >
      <Stack.Screen name="MainPage" component={MainPage} />
      <Stack.Screen name="Signup" component={Signup}/>
      <Stack.Screen name="Login" component={Login}/>
    </Stack.Navigator>
  )
};

export default Community;