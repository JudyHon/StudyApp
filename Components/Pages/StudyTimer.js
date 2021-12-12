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
import StopWarning from '../Modals/StopWarning';
import SuccessMessage from '../Modals/SuccessMessage';
import { openDatabase } from 'react-native-sqlite-storage';

var database = openDatabase({ name: 'UserDatabase.db' })

const StudyTimer = () => {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    }

    const showTimePicker=()=>{
        setShow(true);
    }

    const [secondsLeft, setSecondsLeft] = useState(5);
    const [isTimerOn, setIsTimerOn] = useState(false);

    useEffect(()=>{
        if (isTimerOn) startTimer()
        else BackgroundTimer.stopBackgroundTimer();
        return ()=>{
            BackgroundTimer.stopBackgroundTimer()
        }
    }, [isTimerOn])

    var isFlipped = false;

    const startTimer = () => {
        BackgroundTimer.runBackgroundTimer(()=>{
            setSecondsLeft(secs => {
                if (secs > 0) return secs - 1
                else return 0
            })
        }, 1000)
    }

    const getItem = async () => {
        const results = await database.executeSql('SELECT rowid as id, value FROM Study_table')
        results.forEach(result => {

        })
    }

    useEffect(()=>{
        if (isTimerOn && secondsLeft === 0) {
            BackgroundTimer.stopBackgroundTimer()
            setSecondsLeft(5);
            setIsTimerOn(false);
            setIsSuccessMessageVisible(true);
            // database.transaction((tx) => {
            //     tx.executeSql(
            //         'INSERT INTO Study_Table (year, month, day, study_time) VALUES (?,?,?)',
            //         [year, month, day, studyTime],
            //         (tx, results) => {
            //             console.log('Results', results.rowsAffected);
            //         }
            //     )
            // })
        }
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
        // if (isFlipped) {
        //     if (!(roll > 170 && 190 > roll)) {
        //         isFlipped = false;
        //         setIsTimerOn(false);
        //         console.log("Stop Timer");
        //     }
        // }
        // else if (roll > 170 && 190 > roll) {
        //     if (!isTimerOn) {                
        //         isFlipped = true;
        //         setIsTimerOn(true);
        //         console.log("Start Timer")
        //     }
        // }
    })
    RNDeviceRotation.start();

    const { StudyAppModule } = NativeModules;
    const lightEvent = new NativeEventEmitter(StudyAppModule);
    const lightSubscription = lightEvent.addListener('LightSensor', event => {
        // console.log(event.light);
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
    const [isStopWarningVisible, setIsStopWarningVisible] = useState(false);
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

    return (
        <>
        <Modal
            isModalVisible={isTimerSettingVisible}
            setModalVisible={setIsTimerSettingVisible}
            component={ <TimerSetting /> }
        />
        <Modal
            isModalVisible={isStopWarningVisible}
            setModalVisible={setIsStopWarningVisible}
            component={ <StopWarning setModalVisible={setIsStopWarningVisible}/> }
            pressToExit={false}
        />
        <Modal
            isModalVisible={isSuccessMessageVisible}
            setModalVisible={setIsSuccessMessageVisible}
            component={ <SuccessMessage setModalVisible={setIsSuccessMessageVisible}/> }
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
                        onPress={() => {
                            if (!isTimerOn && secondsLeft == 0) NativeModules.StudyAppModule.showToast("Must be at least 10 seconds");                     
                            else {                                                   
                                if (isTimerOn) setIsStopWarningVisible(true);
                                setIsTimerOn(isTimerOn => !isTimerOn)         
                            }
                        }}
                        title={isTimerOn ? "Stop" : "Start"}
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

export default StudyTimer;