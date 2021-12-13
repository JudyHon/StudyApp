import React, { useState } from 'react';
import { StyleSheet, Text, View, NativeModules } from 'react-native';
import { Card, Button, Input } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const {StudyAppModule} = NativeModules;

const Signup = ({navigation}) => {
    const [username, setUsername] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const showToast = StudyAppModule.showToast;
    return (
        <View style={{flex:1, paddingBottom: 15}}>
        <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
            <Card.Title style={{fontSize:30}}>Sign Up</Card.Title>
            <Card.Divider/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Input
                    autoComplete="off"
                    textContentType="username"
                    placeholder="Username"
                    value={username}
                    onChangeText={(value)=>setUsername(value)}
                />
                <Input
                    autoComplete="email"
                    textContentType="emailAddress"
                    placeholder="Email Address"
                    value={emailAddress}
                    onChangeText={(value)=>setEmailAddress(value)}
                />
                <Input
                    autoComplete="password"
                    textContentType="password"
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(value)=>setPassword(value)}
                />
                <Button
                    title="Sign up"
                    onPress={()=>{
                        if (username == "") {
                            showToast('Username is empty!')
                        } else if (emailAddress == "") {
                            showToast('Email address is empty!')
                        } else if (password == "") {
                            showToast('Password is empty!')
                        } else {
                            auth()
                            .createUserWithEmailAndPassword(emailAddress, password)
                            .then((res)=>{
                                res.user.updateProfile({
                                    displayName: username
                                })
                                firestore().collection("Users").doc(auth().currentUser.uid)
                                .set({username})
                                .then(()=>{
                                    console.log("Data created")
                                })
                                console.log("User created")
                                navigation.goBack()
                            })
                            .catch(error => {
                                if (error.code === 'auth/email-already-in-use') {
                                    showToast('Email address is already in use!');
                                }

                                if (error.code === 'auth/invalid-email') {
                                    showToast("Invalid email address!")
                                }
                                if (error.code === 'auth/weak-password') {
                                    showToast("Password should be at least 6 characters!")
                                }
                                if (error.code === 'auth/network-request-failed') {
                                    showToast("No network connection!")
                                }
                                console.log(error)
                            })
                        }
                    }}
                />
            </View>
        </Card>
        </View>
    )

}

export default Signup;