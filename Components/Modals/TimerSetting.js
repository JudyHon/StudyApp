/**
 * COMP4521 Group 25
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { ListItem, Divider } from "react-native-elements";
import ToggleSwitch from "../ToggleSwitch";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerSetting = () => {

    const [isAwake, setIsAwake] = useState(false);

    useEffect(()=>{
        (async function getData() {
            try {
                const value = await AsyncStorage.getItem('@StudyApp:Awake');
                if (value) setIsAwake(value == "true" ? true : false);
            } catch {}
        })()
    }, [])
    
    return (    
        <View style={{width:280, margin:10}}>
            <Text style={{fontSize: 20, margin:5, alignSelf:'center', fontWeight:'bold', color:'black'}}>Setting</Text>
            <Divider color='#555555'/>
            <ListItem containerStyle={{padding:10}}>
                <ListItem.Content>
                    <ListItem.Title style={{fontSize: 18}}>Keep the screen awake</ListItem.Title>
                </ListItem.Content>            
                <ToggleSwitch
                    value={isAwake}
                    onValueChange={
                        async(value)=>{
                            setIsAwake(value);
                            await AsyncStorage.setItem('@StudyApp:Awake', value.toString());                            
                        }
                    }
                    size={20}               
                />
            </ListItem>
        </View>
    )
}

export default TimerSetting;