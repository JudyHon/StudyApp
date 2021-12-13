/**
 * COMP4521 Group 25
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, NativeEventEmitter, NativeModules, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-elements';
import BackgroundTimer from 'react-native-background-timer';
import KeepAwake from 'react-native-keep-awake';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from '../MyModal';
import { TimerSetting, StopWarning, SuccessMessage, SelectTime, FlipWarning } from '../Modals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNDeviceRotation from 'react-native-device-rotation';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import uuid from 'react-native-uuid';


var isTimerStart = false;
var isFlippedStudyMode = false;
var isEnded = false;
var isLight = false;

const StudyTimer = () => {

    // === Firebase ===
    // Check Current User with Firebase Authentication
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

    const saveDataToFirebaseHelper = async (isGivenUp, userCollection, uid, date) => {
        var isExist = false;
        var studyTime = parseInt(await AsyncStorage.getItem('@StudyApp:secondsLeft'));
        var hasGivenUp = isGivenUp;
        await firestore().collection(userCollection).doc(uid).collection("StudyRecords").doc(date).get()
        .then(documentSnapshot=>{
            if (documentSnapshot.exists) {
                isExist = true;
                if (!isGivenUp) studyTime += documentSnapshot.data().studyTime
                else studyTime = documentSnapshot.data().studyTime;                
                if (documentSnapshot.data().hasGivenUp) hasGivenUp = true;
            }
        })

        console.log("SAVE DATA")
        console.log(isExist)
        // If records does not exist, create one. Otherwise, update records.
        if (isExist) {
            await firestore()
            .collection(userCollection)
            .doc(uid)
            .collection("StudyRecords")
            .doc(date)
            .update({
                studyTime,
                hasGivenUp
            })
        } else {
            await firestore()
            .collection(userCollection)
            .doc(uid)
            .collection("StudyRecords")
            .doc(date)
            .set({
                studyTime: isGivenUp ? 0 : studyTime,
                hasGivenUp:isGivenUp,
                date
            })
        }
    }

    // Save the data to firestore in both user and anonymous form
    const saveDataToFirebase = async(isGivenUp) => {
        var uid = await AsyncStorage.getItem('@StudyApp:anonymousUid');
        if (!uid) {
            uid = uuid.v4();
            await AsyncStorage.setItem('@StudyApp:anonymousUid', uid);
        }

        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const newDate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).split('T')[0];

        const hasGivenUp = isGivenUp ? true : false;          
        console.log("Save the Data to firestore", hasGivenUp)    
        saveDataToFirebaseHelper(hasGivenUp, 'Anonymous', uid, newDate) 
        if (user) saveDataToFirebaseHelper(hasGivenUp, 'Users', user.uid, newDate) 
    }


    // === Timer ===
    const [secondsLeft, setSecondsLeft] = useState(5);
    const [isTimerOn, setIsTimerOn] = useState(false);

    // Retrieve the previous setting
    useEffect(()=>{
        (async function getData() {
            try {
                const value = await AsyncStorage.getItem('@StudyApp:secondsLeft');
                if (value) setSecondsLeft(parseInt(value));
                else {
                    await AsyncStorage.setItem('@StudyApp:secondsLeft', (25 * 60).toString())
                    setSecondsLeft(25*60);
                }
            } catch {}
        })()
    }, [])

    // Enable the backgroundTimer
    useEffect(()=>{
        if (isTimerOn) startTimer()
        else BackgroundTimer.stopBackgroundTimer();
        return ()=>{
            BackgroundTimer.stopBackgroundTimer()
        }
    }, [isTimerOn])

    const startTimer = () => {
        BackgroundTimer.runBackgroundTimer(()=>{
            setSecondsLeft(secs => {
                if (secs > 0) return secs - 1
                else return 0
            })
        }, 1000)
    }

    // When the timer ends (secondsLeft is 0)
    useEffect(()=>{
        if (isTimerOn && secondsLeft === 0) {
            BackgroundTimer.stopBackgroundTimer()
            setIsTimerOn(false);
            isTimerStart = false;
            if (isFlippedStudyMode) isEnded = true;
            (async function getData() {
                try {
                    const value = await AsyncStorage.getItem('@StudyApp:secondsLeft');
                    if (value) setSecondsLeft(parseInt(value));
                } catch {}
            })()
            setIsSuccessMessageVisible(true);
            saveDataToFirebase(false);
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

    const setTimerOff = () => {
        isFlippedStudyMode = false;
        isTimerStart = false;
        setIsTimerOn(false);
    }

    // --- Sensors ---
    const orientationEvent = new NativeEventEmitter(RNDeviceRotation);
    const subscription =  orientationEvent.addListener('DeviceRotation', event => {
        const {roll} = event
        if (!isFlippedStudyMode && isTimerStart) return; // Do nothing when manually start timer
        if (isFlippedStudyMode) {
            if (!(roll > 170 && 190 > roll)) {
                if (isTimerStart) {
                    // Stop Timer
                    isTimerStart = false;
                    setIsTimerOn(false);
                    setIsFlipWarningVisible(true);
                    console.log("StopTimer")
                } else {
                    if (isEnded) {
                        // Timer is ended
                        isFlippedStudyMode = false;
                        isEnded = false;
                    }
                }
            } else if (!isTimerStart && !isEnded) {
                // Continue Timer
                setIsTimerOn(true)
                setIsFlipWarningVisible(false);
                isTimerStart = true;
                console.log("ContinueTimer")                
            }
        } else if (roll > 170 && 190 > roll) {
            if (isLight && !isEnded) {
                // Start Timer
                setIsTimerOn(true)
                isFlippedStudyMode = true;
                isTimerStart = true;
                console.log("StartTimer")
            }
        }
    })
    RNDeviceRotation.start();

    const { StudyAppModule } = NativeModules;
    const lightEvent = new NativeEventEmitter(StudyAppModule);
    const lightSubscription = lightEvent.addListener('LightSensor', event => {
        const {light} = event;
        if (light < 5) isLight = true;
        else isLight = false;
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

    // Set up of keeping app awake
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

    // Modal Setting
    const [isTimerSettingVisible, setIsTimerSettingVisible] = useState(false);
    const [isStopWarningVisible, setIsStopWarningVisible] = useState(false);
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
    const [isSelectTimeVisible, setIsSelectTimeVisible] = useState(false);
    const [isFlipWarningVisible, setIsFlipWarningVisible] = useState(false);
    
    const [buttonDisable, setButtonDisable] = useState(false);

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
            component={ 
                <StopWarning 
                    setModalVisible={setIsStopWarningVisible}
                    setButtonDisable={setButtonDisable}
                    saveData={saveDataToFirebase}
                    setTimerOn={setIsTimerOn}
                    setSecondsLeft={setSecondsLeft}
                    setTimerOff={setTimerOff}
                />
            }
            pressToExit={false}
        />
        <Modal
            isModalVisible={isFlipWarningVisible}
            setModalVisible={setIsFlipWarningVisible}
            component={
                <FlipWarning
                    setModalVisible={setIsFlipWarningVisible}
                    setSecondsLeft={setSecondsLeft}
                    setTimerOff={setTimerOff}
                    saveData={saveDataToFirebase}
                />
            }
            pressToExit={false}
        />
        <Modal
            isModalVisible={isSuccessMessageVisible}
            setModalVisible={setIsSuccessMessageVisible}
            component={ <SuccessMessage setModalVisible={setIsSuccessMessageVisible}/> }
        />
        <Modal
            isModalVisible={isSelectTimeVisible}
            setModalVisible={setIsSelectTimeVisible}
            component={ <SelectTime setModalVisible={setIsSelectTimeVisible} setSecondsLeft={setSecondsLeft} /> }
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
                    
                    <TouchableOpacity onPress={()=>{setIsSelectTimeVisible(true)}} disabled={isTimerOn}>
                        <View style={styles.circle}>
                                <Text style={styles.timeFont}>
                                    {formatClock().formatHours} : {formatClock().formatMinutes} :{" "}
                                    {formatClock().formatSeconds}
                                </Text>
                        </View>                    
                    </TouchableOpacity>
                    <Button
                        disabled={buttonDisable}
                        disabledStyle={{backgroundColor:"#2288dd"}}
                        disabledTitleStyle={{color:"#ffffff"}}
                        onPress={() => {                                      
                            if (isTimerOn) {                                            
                                setButtonDisable(true);       
                                setIsStopWarningVisible(true);
                            } else {
                                isTimerStart = true;
                            }
                            setIsTimerOn(isTimerOn => !isTimerOn)
                        }}
                        title={isTimerOn ? "Stop" : "Start"}
                        buttonStyle={{width: Dimensions.get('window').width*0.6}}
                        titleStyle={{fontSize:25}}
                    />
                </View>
            </Card>
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
        margin:30
    },
    timeFont: {
        color: 'black',
        fontSize: width * 0.09        
    }
});

export default StudyTimer;