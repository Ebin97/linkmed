import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import StackNavigation from '../MedConnect/navigation/stackNavigation';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OneSignal from 'react-native-onesignal';

const App = () => {

  useEffect(() => {
    OneSignal.setLogLevel(6, 0)
    OneSignal.setAppId("b3b4fbdf-baf8-428c-bdd2-668fb0c79617");
    OneSignal.promptForPushNotificationsWithUserResponse();
    OneSignal.setNotificationWillShowInForegroundHandler(async (notificationReceivedEvent) => {
      let notification = notificationReceivedEvent.getNotification();

      notificationReceivedEvent.complete(notification);
    })

  }, [])
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );

}


export default App;