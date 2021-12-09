import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react';
import { useEffect } from 'react';
import BackgroundTimer from 'react-native-background-timer';

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

    return (
        <View style={{flex:1}}>
            <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
                <Card.Title style={{fontSize:30}}>Study Timer</Card.Title>
                <Card.Divider/>
                <View style={{flex:1, justifyContent:'center'}}>
                    <Text style={{color:'black', fontSize:20}}>
                        {formatClock().formatHours} Hours {formatClock().formatMinutes} Mins{" "}
                        {formatClock().formatSeconds} Secs
                    </Text>
                    <Button
                        onPress={showTimePicker}
                        title="Open Time Picker"
                    />
                    <Button
                        onPress={() => setTimerOn(timerOn => !timerOn)}
                        title="Start"
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

});

export default Homepage;