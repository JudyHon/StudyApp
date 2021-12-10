import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import ToggleSwitch from '../ToggleSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = () => {

    const [isNotiOn, setIsNotiOn] = useState(false);

    useEffect(()=>{
        (async function getData() {
            try {
                const value = await AsyncStorage.getItem('@StudyApp:Notification');
                if (value) setIsNotiOn(value == "true" ? true : false);
            } catch(e) {
                console.log(e);
            }
        })()
    }, [])

    return (
        <View style={{flex:1, paddingBottom: 15}}>
            <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
                <Card.Title style={{fontSize:30}}>Setting</Card.Title>
                <Card.Divider/>
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
                <ListItem bottomDivider onPress={()=>{}}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.title}>Study Reminder</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtitle}>Set up the reminder for studying</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron size={30}/>
                </ListItem>
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