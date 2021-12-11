import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Card, Button, Slider } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Progress = () => {

  const {width} = Dimensions.get('window');

  const dateArray = Array(35).fill(0);

  const now = new Date();
  const [date, setDate] = useState({year: now.getFullYear(), month: now.getMonth()+1})

  const [value, setValue] = useState(0.5)

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
            <View style={{flex:1, flexDirection: 'row', flexWrap:'wrap', justifyContent:'center'}}>
              {dateArray.map((_, index)=>{
                return <Button buttonStyle={{width: width * 0.1145834, height: width * 0.1145834, borderWidth: 2, backgroundColor:`rgba(100,175,235,${value})`}} key={index.toString()} type="outline" />;
              })}
            </View>
            <Text style={{color:'black'}}>Set Your Study Goal:</Text>
            <Slider
              value={value}
              onValueChange={(value)=>setValue(value)}
              thumbStyle={{height:20,width:20, backgroundColor:'#2288dd'}}
            />
            <Text style={{color:'black'}}>{value} Hour(s) Minute(s)</Text>
        </Card>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Progress;