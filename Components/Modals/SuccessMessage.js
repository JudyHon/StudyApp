/**
 * COMP4521
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React from "react";
import { View, Text } from "react-native";
import { Button, Divider } from "react-native-elements";

const SuccessMessage = ({setModalVisible}) => {

    return (    
        <View style={{width:280, margin:10, justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontSize: 20, margin:5, fontWeight:'bold', color:'black'}}>Finish</Text>
            <Divider color='#555555' style={{width:"80%"}} />
            <Text style={{fontSize: 18, color:'black', margin:10}}>You have successfully studied!</Text>
            <View style={{flexDirection:'row-reverse'}}>
                <Button
                    title='Okay'
                    buttonStyle={{width: 50, padding:5}}
                    onPress={()=>{setModalVisible(false)}}
                />
            </View>
        </View>
    )
}

export default SuccessMessage;