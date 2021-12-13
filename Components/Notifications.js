/**
 * COMP4521 Group 25
 * HON, Tsz Ching 20608119 tchonaa@connect.ust.hk 
 * 
 */

import PushNotification from 'react-native-push-notification';

class Notifications {
    constructor() {
        PushNotification.configure({

            onRegister: function (token) {
                console.log("TOKEN:", token);
            },
        
            // Called when a local notification is opened
            onNotification: function (notification) {
                console.log("NOTIFICATION:", notification);
            },
        
            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                console.log("NOTIFICATION:", notification);
                // process the action
            },

            popInitialNotification: true,
            requestPermissions: true,
        });

        PushNotification.createChannel(
            {
                channelId: 'quotes',
                channelName: 'Motivational quote notifications',
                channelDescription: 'Providing motivational quotes'
            },
            ()=>{}
        )

        PushNotification.getScheduledLocalNotifications(rn=>{
            console.log('ScheduledNotification:', rn)
        })
    }

    scheduleNotification() {
        var date = new Date(new Date().setHours(12,0,0,0));
        PushNotification.localNotificationSchedule({
            channelId: 'quotes',
            title: 'Here is your motivational quote!',
            message: '“We cannot solve problems with the kind of thinking we employed when we came up with them.” — Albert Einstein',
            date,
            repeatType: 'day'
        })
    }

    deleteNotification() {
        PushNotification.cancelAllLocalNotifications()
    }
}
export default new Notifications();