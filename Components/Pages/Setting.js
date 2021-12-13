/**
 * COMP4521
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import ToggleSwitch from '../ToggleSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const Setting = ({navigation}) => {

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
    
    const [isNotiOn, setIsNotiOn] = useState(false);

    useEffect(()=>{
        (async function getData() {
            try {
                const value = await AsyncStorage.getItem('@StudyApp:Notification');
                if (value) setIsNotiOn(value == "true" ? true : false);
            } catch {}
        })()
    }, [])

    if (initializing) return null;

    return (
        <View style={{flex:1, paddingBottom: 15}}>
            <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
                <Card.Title style={{fontSize:30}}>Setting</Card.Title>
                <Card.Divider/>
                {user ? 
                <ListItem bottomDivider onPress={()=>{auth().signOut()}}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>Nice to see you, {user.displayName}!</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtitle}>Click to Log out</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem> :
                <ListItem bottomDivider onPress={()=>{navigation.navigate("Community")}}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>Sign Up/Login</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtitle}>Log in to access the community</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
                }

                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>Notification</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtitle}>Turn on/off the notification to provide you motivation for studying</ListItem.Subtitle>
                    </ListItem.Content>
                    <ToggleSwitch
                        value={isNotiOn}
                        onValueChange={
                            async(value)=>{
                                setIsNotiOn(value);
                                await AsyncStorage.setItem('@StudyApp:Notification', value.toString());                            
                            }
                        }
                    />
                </ListItem>
                {/* <ListItem bottomDivider onPress={()=>{}}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>Study Reminder</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtitle}>Set up the reminder for studying</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron size={30}/>
                </ListItem> */}
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize:25,
        fontWeight:'bold'
    },
    subtitle: {
        fontSize:15
    }
});

export default Setting;