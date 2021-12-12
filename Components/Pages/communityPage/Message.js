import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, NativeModules, Keyboard } from 'react-native';
import { Card, Button, Input, ListItem } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import uuid from 'react-native-uuid';

const { StudyAppModule } = NativeModules;
const showToast = StudyAppModule.showToast;

const Message = () => {

    useEffect(()=>{
        const subscriber = firestore()
            .collection('Posts')
            .orderBy('date', 'desc')
            .onSnapshot(querySnapshot=>{
                var list = []
                const size = querySnapshot.size;
                querySnapshot.forEach((documentSnapshot, index)=>{
                    const data = documentSnapshot.data();
                    firestore()
                        .collection('Users')
                        .doc(data.userID)
                        .get()
                        .then(documentSnapshot=>{
                            const username = documentSnapshot.data().username;
                            const message = data.message;
                            const date = formatDate(data.date)
                            list.push({username, message, date})
                            if (size-1 == index) {
                                setMessageList(list);
                                setIsLoaded(true);
                            }
                        })
                })
                console.log("New Data")
            })
        return () => subscriber()
    }, [])

    const [isLoaded, setIsLoaded] = useState(false);

    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");

    const formatDate = (inputDate) => {
        const date = new Date(inputDate.seconds*1000)
        const year = date.getFullYear()
        const month = (date.getMonth()+1)
        const day = date.getDate()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return `${year}-${month < 10 ? "0"+month : month}-${day < 10 ? "0"+day : day} ${hours < 10 ? "0"+hours:hours}:${minutes<10?"0"+minutes:minutes}`
    }

    const renderMessage = ({item}) => {
        return (
            <ListItem bottomDivider containerStyle={{padding:10}}>
                <ListItem.Content>
                    <ListItem.Title style={{fontSize:20}}>{item.message}</ListItem.Title>
                    <View style={{flexDirection:'row'}}>                        
                        <ListItem.Subtitle style={{marginRight:10}}>{item.username}</ListItem.Subtitle>
                        <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
                    </View>
                </ListItem.Content>
            </ListItem>
        )
    }

    const keyExtractor = (_, index) => index.toString();

    return (
        <>
        {isLoaded ? 
        <>
        <View style={{flex:1, width:"100%"}}>
            <FlatList
                data={messageList}
                renderItem={renderMessage}
                keyExtractor={keyExtractor}
            />
        </View>
        <View style={{flexDirection:'row', width:"100%", alignItems:'center'}}>
            <Input
                containerStyle={{flex:1}}
                placeholder="Send your message!"
                onChangeText={(value)=>setMessage(value)}
                value={message}
            />
            <Button
                title="Send"
                onPress={()=>{
                    if (message) {
                        firestore()
                            .collection("Posts")
                            .doc(uuid.v4())
                            .set({userID: auth().currentUser.uid, message, date: new Date()})
                            .then(()=>{
                                console.log("Data created")
                            })
                        setMessage("")
                        Keyboard.dismiss()
                    }
                    else {                        
                        showToast("Message cannot be empty!")
                    }
                }}
            />
        </View>
        </> :
        <>
            <Text style={{fontSize:25, color:'black'}}>Loading...</Text>
        </>
        }
        </>
    );
};

const styles = StyleSheet.create({

});

export default Message;