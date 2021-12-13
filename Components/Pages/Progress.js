/**
 * COMP4521
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Card, Button, Slider } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Progress = () => {

  const dateArray = Array(7).fill(0);

  const now = new Date();
  const [date, setDate] = useState({year: now.getFullYear(), month: now.getMonth()+1})

  const [showData, setShowData] = useState()

  const [value, setValue] = useState(3600/54000)
  const [list, setList] = useState([]);

  const [uid, setUid] = useState();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(()=>{
    (async function getData() {
      const uid = await AsyncStorage.getItem('@StudyApp:anonymousUid')
      if (uid) setUid(uid)
      const goal = await AsyncStorage.getItem('@StudyApp:goal')
      if (goal) {
        console.log(goal)
        setValue(parseFloat(goal))
      }      
    })()
  },[])

  useEffect(()=>{
    var subscriber;
    if (uid) {
      subscriber = firestore()
          .collection('Anonymous')
          .doc(uid)
          .collection("StudyRecords")
          .onSnapshot(querySnapshot=>{
              setShowData(null)
              setIsUpdated(false);
              console.log("New Study Data")
          })
    }
    return () => {if(subscriber) subscriber()}
  }, [uid])

  useEffect(()=>{
    setIsUpdated(false);
  }, [date.year])

  useEffect(()=>{
    if (!isUpdated) {
      (async function startUpdate(){
        await updateList()
        setIsUpdated(true)
      })()
    }
  }, [isUpdated])

  const updateList = async() => {
    const {year,month} = date;
    const startDate =  new Date(year, 0, 2).toISOString().split('T')[0]
    const endDate = new Date(year, 12, 1).toISOString().split('T')[0]
    const uid = await AsyncStorage.getItem('@StudyApp:anonymousUid')
    console.log({startDate})
    console.log({endDate})
    if (uid) {
    await firestore()
      .collection('Anonymous')
      .doc(uid)
      .collection("StudyRecords")
      .orderBy('date', 'asc')
      .startAt(startDate)
      .endAt(endDate)
      .get()
      .then(querySnapshot=>{
        var list = [];
        querySnapshot.forEach((documentSnapshot, index)=>{
          console.log(documentSnapshot.data())
          list.push(documentSnapshot.data())
          if (querySnapshot.size-1 == index) {
            setList(list);
            console.log("Set List")
          }
        })
      })
    }
  }

  const renderRowButton = (row) => {

    const {year,month} = date;
    const newDate = new Date(`${year}-${month<10?"0"+month:month}-01`)
    const dayToLastMonth = newDate.getDay();
    const startDate =  new Date(year, month-1, 2 - dayToLastMonth + row*7 - 1)
    
    return (dateArray.map((_, index)=>{
      var backgroundColor = `rgba(0,0,0,0)`
      const title = startDate.getDate()
      var color = '#2288dd'
      if (row == 0 && startDate.getDate() > 15) color = '#a5d2f7'
      if ((row == 4 || row == 5) && startDate.getDate() < 15) color = '#a5d2f7'
      startDate.setDate(startDate.getDate()+1)
      var data;
      if (list.length > 0) 
        data = list.find(element => element.date === startDate.toISOString().split('T')[0]);
      if (data) {
        const goal = 54000 * value;
        const opacity = goal > 0 ? data.studyTime/goal : 0.5;
        backgroundColor = data.hasGivenUp ? `rgba(230,70,70,0.5)` : `rgba(100,175,235,${opacity})`;
      }
     
      return (
        <Button
          titleStyle={{color}}
          title={title}
          onPress={()=>{
            if (data) {
              console.log("Hi", data)
              setShowData(data)
            } else {setShowData(null)}
          }}
          buttonStyle={[styles.button, {backgroundColor:`rgba(100,175,235,${backgroundColor})`, alignItems:'flex-start', padding:5, paddingTop:0}]}
          key={index.toString()}
          type="outline"
        />
      )
    }))
  }
  const renderButton = () => {
    return (
      <>
        <View style={{flexDirection:'row'}}>
          {renderRowButton(0)}
        </View>
        <View style={{flexDirection:'row'}}>
          {renderRowButton(1)}
        </View>
        <View style={{flexDirection:'row'}}>
          {renderRowButton(2)}
        </View>
        <View style={{flexDirection:'row'}}>
          {renderRowButton(3)}
        </View>
        <View style={{flexDirection:'row'}}>
          {renderRowButton(4)}
        </View>
        <View style={{flexDirection:'row'}}>
          {renderRowButton(5)}
        </View>
        
      </>
    )
  }

  const formatGoal = () => {
    const goal = 54000 * value;
    let hours = Math.floor(goal/60/60)
    let minutes = Math.floor(Math.floor((goal/60)%60)/5)*5

    let formatHours = hours < 10 ? `0${hours}` : hours
    let formatMinutes = minutes < 10 ? `0${minutes}` : minutes

    return { formatHours, formatMinutes }
  }

  const formatTime = (time) => {
    let hours = Math.floor(time/60/60)
    let minutes = Math.floor((time/60)%60)
    let seconds = Math.floor(time%60)

    let formatHours = hours < 10 ? `0${hours}` : hours
    let formatMinutes = minutes < 10 ? `0${minutes}` : minutes
    let formatSeconds = seconds < 10 ? `0${seconds}` : seconds
    return { formatHours, formatMinutes, formatSeconds }
  }

  return (
    <View style={{flex:1, paddingBottom: 15}}>
        <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
            <Card.Title style={{fontSize:30}}>Progress Tracker</Card.Title>
            <Card.Divider/>
            <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', marginBottom:10}}>
              <MaterialCommunityIcons 
                name="chevron-left"
                color="grey"
                size={25}
                onPress={()=>{
                  var {year, month} = date;
                  if (date.month <= 1) year -= 1;
                  month -= 1;
                  if (month == 0) month = 12;
                  setDate({year, month});
                }}
              />
              <Text style={{color:'black', alignSelf:'center', fontSize:20}}>{date.year}-{date.month}</Text>
              <MaterialCommunityIcons 
                name="chevron-right"
                color="grey"
                size={25}
                onPress={()=>{
                  var {year, month} = date;
                  if (date.month > 11) year += 1;
                  month = (month+1) % 12;
                  if (month == 0) month = 12;
                  setDate({year, month});
                }}
              />
            </View>
            <View style={{flex:1, justifyContent:'flex-start', alignItems:'center'}}>
              {renderButton()}
              {
                showData ? 
                <>
                  <Text style={styles.titleFont}>{showData.date}</Text>
                  <Text style={[styles.titleFont, {marginBottom: 5}]}>Study Time</Text>
                  <Text style={styles.font}>
                    {formatTime(showData.studyTime).formatHours} Hour(s){" "}
                    {formatTime(showData.studyTime).formatMinutes} Minute(s){" "}
                    {formatTime(showData.studyTime).formatSeconds} Second(s)
                  </Text>
                </> : null
              }
            </View>
            
            <Text style={[styles.font, {fontWeight:'bold'}]}>Set Your Study Goal:</Text>
            <Slider
              value={value}
              onValueChange={
                async (value)=> {
                  await AsyncStorage.setItem('@StudyApp:goal', value.toString())
                  setValue(value);
                }
              }
              thumbStyle={{height:20,width:20, backgroundColor:'#2288dd'}}
            />
            <Text style={styles.font}>{formatGoal().formatHours} Hour(s) {formatGoal().formatMinutes} Minute(s)</Text>
        </Card>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  button:{
    justifyContent: 'flex-end',
    width: width * 0.1145834,
    height: width * 0.1145834,
    borderWidth: 2, 
  },
  font:{
    fontSize: 18,
    color:'black'
  },
  titleFont:{
    margin:10,
    color:'black',
    fontSize:20,
    alignSelf:'flex-start',
    fontWeight:'bold'
  }
});

export default Progress;