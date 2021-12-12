import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import Message from './communityPage/Message';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './communityPage/MainPage';
import Signup from './communityPage/Signup';
import Login from './communityPage/Login';
import { NavigationContainer } from '@react-navigation/native';

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

const styles = StyleSheet.create({

});

export default Community;