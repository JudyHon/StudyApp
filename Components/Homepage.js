import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, LogBox } from 'react-native';
import { Card, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker'
import BackgroundTimer from 'react-native-background-timer';
import { accelerometer, gyroscope } from 'react-native-sensors';

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

    // const subscription = gyroscope.subscribe(({x,y,z,timestamp}) =>
    //     console.log({x,y,z,timestamp})
    // )

    useEffect(()=>{
        return () => {
            console.log("Timer Unmount")
            subscription.unsubscribe()
        }
    }, [])

    LogBox.ignoreLogs(["`new NativeEventEmitter()` was called with"])

    return (
        <View style={{flex:1, paddingBottom: 15}}>
            <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
                <Card.Title style={{fontSize:30}}>Study Timer</Card.Title>
                <Card.Divider/>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
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
    );
};

const styles = StyleSheet.create({
    circle: {
        borderWidth:5,
        borderColor: '#2288dd',
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height)/2,
        width: Dimensions.get('window').width * 0.6,
        height: Dimensions.get('window').width * 0.6,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    }
});

export default Homepage;