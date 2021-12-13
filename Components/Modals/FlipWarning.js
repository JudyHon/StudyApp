/**
 * COMP4521 Group 25
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

 import React from "react";
 import { View, Text } from "react-native";
 import { Button, Divider } from "react-native-elements";
 import AsyncStorage from "@react-native-async-storage/async-storage";
 
 const FlipWarning = ({setModalVisible, saveData, setSecondsLeft, setTimerOff}) => {
 
     return (    
         <View style={{width:300, padding:10, justifyContent:'center', alignItems:'center'}}>
             <Text style={{fontSize: 20, margin:5, fontWeight:'bold', color:'black'}}>Stop the Timer</Text>
             <Divider color='#555555' style={{width:"80%"}} />
             <Text style={{fontSize: 18, color:'black', margin:10, alignSelf:'flex-start'}}>Are you giving up?{'\n'}You can flip back the phone to continue</Text>
             <View style={{flexDirection:'row-reverse'}}>
                 <Button
                     title='Give up'
                     buttonStyle={{width: 100, marginLeft:10, padding:5}}
                     onPress={async()=>{
                         await saveData(true);             
                         setSecondsLeft(parseInt(await AsyncStorage.getItem('@StudyApp:secondsLeft')));
                         setTimerOff();
                         setModalVisible(false);
                     }}
                 />
             </View>
         </View>
     )
 }
 
 export default FlipWarning;