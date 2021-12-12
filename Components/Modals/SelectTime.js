import React, { useState, useEffect } from 'react';
import { NativeModules, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, Input } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {StudyAppModule} = NativeModules;
const showToast = StudyAppModule.showToast;

const SelectTime = ({setModalVisible, setSecondsLeft}) => {

    const [hours, setHours] = useState("")
    const [minutes, setMinutes] = useState("")
    const [seconds, setSeconds] = useState("")

    return (
        <View style={{width:280, margin:10, justifyContent:"center"}}>
            <Text style={{fontSize: 20, margin:5, alignSelf:'center', fontWeight:'bold', color:'black'}}>Set Timer</Text>
            <Divider color='#555555'/>
            <View style={{width:"100%", flexDirection:"row", alignItems:'center'}}>
            <Input
                keyboardType='numeric'
                containerStyle={{flex:1}}
                placeholder="HH"
                onChangeText={(input)=>{
                    var value = input.replace(/[^0-9]/g,'')
                    if(parseInt(value) > 23) value = "23"
                    setHours(value)
                }}
                value={hours}
                maxLength={2}
            />
            <Text style={styles.column}>:</Text>
            <Input
                keyboardType='numeric'
                containerStyle={{flex:1}}
                placeholder="MM"
                onChangeText={(input)=>{
                    var value = input.replace(/[^0-9]/g,'')
                    if(parseInt(value) > 59) value = "59"
                    setMinutes(value);
                }}
                value={minutes}
                maxLength={2}
            />
            <Text style={styles.column}>:</Text>
            <Input
                keyboardType='numeric'
                containerStyle={{flex:1}}
                placeholder="SS"
                onChangeText={(input)=>{
                    var value = input.replace(/[^0-9]/g,'')
                    if(parseInt(value) > 59) value = "59"
                    setSeconds(value)
                }}
                value={seconds}
                maxLength={2}
            />
            </View>
            <Button
                title="Confirm"
                buttonStyle={{width:"30%", alignSelf:"center"}}
                onPress={async()=>{
                    var secondsLeft = 0;
                    hours != "" ? secondsLeft += parseInt(hours) * 60 * 60 : null;
                    minutes != "" ? secondsLeft += parseInt(minutes) * 60 : null;
                    seconds != "" ? secondsLeft += parseInt(seconds) : null;
                    if (hours == "" && minutes == "" && seconds == "") setModalVisible(false);
                    else if (secondsLeft > 0) {
                        setSecondsLeft(secondsLeft);
                        await AsyncStorage.setItem('@StudyApp:secondsLeft', secondsLeft.toString()); 
                        setHours("")
                        setMinutes("")
                        setSeconds("")
                        setModalVisible(false);
                    }
                    else {
                        showToast("Study time must be more than 1 second")
                    }
                    
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    column:{
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15
    }
})

export default SelectTime;
