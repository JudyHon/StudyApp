/**
 * COMP4521 Group 25
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

// A modal component
const MyModal = ({isModalVisible, setModalVisible, component, pressToExit}) => {
    const isPressToExit = pressToExit == null ? true : pressToExit;
    return (
        <Modal
            visible={ isModalVisible }
            onRequestClose={() => {}}
            transparent={true}
            animationType='fade'
        >         
            <TouchableOpacity 
                style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)'}}
                activeOpacity={1}
                onPressOut={() => {isPressToExit ? setModalVisible(false) : null}}
            >
                <TouchableWithoutFeedback>
                    <View style={[styles.modal]}>
                        {component}
                    </View>                        
                </TouchableWithoutFeedback> 
            </TouchableOpacity> 
                  
        </Modal>
    )
}

const styles = StyleSheet.create({
    button: {
        padding:5,
        marginTop: 15,
        marginLeft:20,
        marginRight:20,  
        marginBottom: 5,      
        width:100,
    },
    modal: {
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        }, 
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    }
});

export default MyModal;