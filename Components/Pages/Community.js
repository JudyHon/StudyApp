import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';

const Community = () => {

  return (
    <View style={{flex:1, paddingBottom: 15}}>
        <Card containerStyle={{flex:1}} wrapperStyle={{flex:1}}>
            <Card.Title style={{fontSize:30}}>Community</Card.Title>
            <Card.Divider/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:'black', fontSize: 20}}>Login/Sign up {"\n"}to access the community</Text>
                <View style={{flexDirection:'row-reverse', }}>
                  <Button
                    title="Login"
                    buttonStyle={{margin:10}}
                  />
                  <Button
                    title="Sign Up"
                    buttonStyle={{margin:10}}
                  />
                </View>
                
            </View>
        </Card>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Community;