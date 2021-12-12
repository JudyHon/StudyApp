import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import Message from './Message';

const MainPage = ({ navigation }) => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [])

  if (initializing) return null;

  return (
    <View style={{flex:1, paddingBottom: 15}}>
        <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
            <Card.Title style={{fontSize:30}}>Community</Card.Title>
            <Card.Divider/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>

            {!user ? 
              <>
                <Text style={{color:'black', fontSize: 20}}>Login/Sign up {"\n"}to access the community</Text>
                <View style={{flexDirection:'row-reverse', }}>
                  <Button
                    title="Login"
                    buttonStyle={{margin:10}}
                    onPress={()=>navigation.navigate('Login')}
                  />
                  <Button
                    title="Sign Up"
                    buttonStyle={{margin:10}}
                    onPress={()=>navigation.navigate('Signup')}
                  />
                </View> 
              </>:
              <Message /> 
            }
                
            </View>
        </Card>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default MainPage;