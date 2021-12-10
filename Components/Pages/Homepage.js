import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, NativeEventEmitter, NativeModules } from 'react-native';
import { Card, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker'
import BackgroundTimer from 'react-native-background-timer';
import KeepAwake from 'react-native-keep-awake';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from '../MyModal';
import TimerSetting from '../Modals/TimerSetting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNDeviceRotation from 'react-native-device-rotation';

const Homepage = () => {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    }

    const showTimePicker=()=>{
        setShow(true);
    }

    const [secondsLeft, setSecondsLeft] = useState(3601);
    const [timerOn, setTimerOn] = useState(false);

    useEffect(()=>{
        if (timerOn) startTimer()
        else BackgroundTimer.stopBackgroundTimer();
        return ()=>{
            BackgroundTimer.stopBackgroundTimer()
        }
    }, [timerOn])

    const startTimer = () => {
        BackgroundTimer.runBackgroundTimer(()=>{
            setSecondsLeft(secs => {
                if (secs > 0) return secs - 1
                else return 0
            })
        }, 1000)
    }

    useEffect(()=>{
        if (secondsLeft === 0) BackgroundTimer.stopBackgroundTimer()
    }, [secondsLeft])

    const formatClock = () => {
        let hours = Math.floor(secondsLeft/60/60)
        let minutes = Math.floor((secondsLeft/60)%60)
        let seconds = Math.floor(secondsLeft%60)

        let formatHours = hours < 10 ? `0${hours}` : hours
        let formatMinutes = minutes < 10 ? `0${minutes}` : minutes
        let formatSeconds = seconds < 10 ? `0${seconds}` : seconds
    
        return { formatHours, formatMinutes, formatSeconds }
    }

    const orientationEvent = new NativeEventEmitter(RNDeviceRotation);
    const subscription =  orientationEvent.addListener('DeviceRotation', event => {
        const roll = event.roll;
        // if (roll > 170 && 190 > roll) console.log("flip")
    })
    RNDeviceRotation.start();

    const { StudyAppModule } = NativeModules;
    const lightEvent = new NativeEventEmitter(StudyAppModule);
    const lightSubscription = lightEvent.addListener('LightSensor', event => {
        console.log(event.light);
    })
    StudyAppModule.start();

    useEffect(()=>{        
        return () => {
            console.log("Timer Unmount")
            if (subscription) subscription.remove();
            if (lightSubscription) lightSubscription.remove();
            RNDeviceRotation.stop();
            StudyAppModule.stop();
        }
    }, [])

    useEffect(()=>{
        (async function getData() {
            try {
                const value = await AsyncStorage.getItem('@StudyApp:Awake');
                if (value) {                    
                    if (value == "true" ? true : false) KeepAwake.activate();
                    else KeepAwake.deactivate();
                }
            } catch(e) { console.log(e); }
        })()
    }, [isTimerSettingVisible])

    const [isTimerSettingVisible, setIsTimerSettingVisible] = useState(false);

    return (
        <>
        <Modal
            isModalVisible={isTimerSettingVisible}
            setModalVisible={setIsTimerSettingVisible}
            component={ <TimerSetting /> }
        />
        <View style={{flex:1, paddingBottom: 15}}>
            <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
                <Card.Title style={{fontSize:30}}>Study Timer</Card.Title>
                <Card.Divider/>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>                
                    <MaterialCommunityIcons 
                        name="cog-outline"
                        color="grey"
                        size={50}
                        style={{right:0, top:0, position:'absolute'}}
                        onPress={()=>{setIsTimerSettingVisible(true)}}
                    />
                    <View style={styles.circle}>
                        <Text style={{color:'black', fontSize:35}}>
                            {formatClock().formatHours} : {formatClock().formatMinutes} :{" "}
                            {formatClock().formatSeconds}
                        </Text>
                    </View>
                    <Button
                        onPress={() => setTimerOn(timerOn => !timerOn)}
                        title={timerOn ? "Stop" : "Start"}
                        buttonStyle={{width: Dimensions.get('window').width*0.6}}
                        titleStyle={{fontSize:25}}
                    />
                </View>
            </Card>
            {show && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    onChange={onChange}
                />
            )}
        </View>
        </>
    );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    circle: {
        borderWidth:5,
        borderColor: '#2288dd',
        borderRadius: (width + height)/2,
        width: width * 0.6,
        height: width * 0.6,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    }
});

export default Homepage;