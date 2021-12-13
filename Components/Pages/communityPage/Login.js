/**
 * COMP4521
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React, { useState } from 'react';
import { View, NativeModules } from 'react-native';
import { Card, Button, Input } from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const {StudyAppModule} = NativeModules;
const showToast = StudyAppModule.showToast;

const Login = ({navigation}) => {
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    return (
        <View style={{flex:1, paddingBottom: 15}}>
        <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
            <Card.Title style={{fontSize:30}}>Login</Card.Title>
            <Card.Divider/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Input
                    placeholder="Email Address"
                    value={emailAddress}
                    onChangeText={(value)=>setEmailAddress(value)}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(value)=>setPassword(value)}
                />
                <Button
                    title="Login"
                    onPress={()=>{
                        if (emailAddress == "") {
                            showToast('Email address is empty!')
                        } else if (password == "") {
                            showToast('Password is empty!')
                        } else {
                            auth()
                                .signInWithEmailAndPassword(emailAddress, password)
                                .then(()=>{
                                    console.log("User Sign In")
                                    navigation.goBack();
                                    
                                })
                                .catch(error => {
                                    console.log(error)
                                    if (error.code === 'auth/user-not-found') {
                                        showToast('Email address is not found!');
                                    }
                                    if (error.code === 'auth/invalid-email') {
                                        showToast("Invalid email address!")
                                    }
                                    if (error.code === 'auth/wrong-password') {
                                        showToast("Invalid password!")
                                    }
                                    if (error.code === 'auth/network-request-failed') {
                                        showToast("No network connection!")
                                    }
                                })
                        }
                    }}
                />
            </View>
        </Card>
        </View>
    )

}

export default Login;