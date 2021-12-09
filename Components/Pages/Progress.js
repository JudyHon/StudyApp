import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';

const Progress = () => {

  return (
    <View style={{flex:1, paddingBottom: 15}}>
        <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
            <Card.Title style={{fontSize:30}}>Progress Tracker</Card.Title>
            <Card.Divider/>
            <View style={{flex:1, justifyContent:'center'}}>
                <Text style={{color:'black'}}>Progress</Text>
            </View>
        </Card>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Progress;