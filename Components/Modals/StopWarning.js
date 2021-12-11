import React from "react";
import { View, Text } from "react-native";
import { Button, Divider } from "react-native-elements";

const StopWarning = ({setModalVisible}) => {

    return (    
        <View style={{width:280, padding:10, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize: 20, margin:5, fontWeight:'bold', color:'black'}}>Stop the Timer</Text>
            <Divider color='#555555' style={{width:"80%"}} />
            <Text style={{fontSize: 20, color:'black', margin:10}}>Are you stopping the study?</Text>
            <View style={{flexDirection:'row-reverse'}}>
                <Button
                    title='Yes'
                    buttonStyle={{width: 50, marginLeft:10, padding:5}}
                    onPress={()=>{setModalVisible(false)}}
                />
                <Button
                    title='No'
                    buttonStyle={{width: 50, marginRight:10, padding:5}}
                    onPress={()=>{setModalVisible(false)}}
                />
            </View>
        </View>
    )
}

export default StopWarning;