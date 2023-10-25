import React, { Component } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "../screens/splashScreen";
import LoginScreen from "../screens/account/loginScreen";
import RegisterScreen from "../screens/account/registerScreen";
import GalleryScreen from "../screens/event/galleryScreen";
import { CameraScreen } from "react-native-camera-kit";
import EventDetails from "../screens/event/detailsScreen";
import FacultyScreen from "../screens/event/facultyScreen";
import FeedBackScreen from "../screens/event/feedbackScreen";
import SendingQuestionScreen from "../screens/event/questionScreen";
import PollingScreen from "../screens/event/pollingScreen";
import ProgramScreen from "../screens/event/programScreen";
import EditProfileScreen from "../screens/account/editProfileScreen";
import forgetPasswordScreen from "../screens/account/forgetPasswordScreen";
import QrScannerScreen from "../screens/scanner/qrScanner";
import CurvedBottomNavigation from "./curvedBottomNavigation";
import SearchScreen from "../screens/main/searchScreen";

const Stack = createNativeStackNavigator();
export default class StackNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let { user } = this.state;
    return (
      <>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false, gestureEnabled: true, }} />

          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false, gestureEnabled: true }} />
          </Stack.Group>

          <Stack.Group>
            <Stack.Screen name="Scanner" component={QrScannerScreen} options={{ headerShown: false, gestureEnabled: true }} />

            <Stack.Screen name="Home" component={CurvedBottomNavigation} options={{ headerShown: false, gestureEnabled: true }} />

            {/* Event Route */}
            <Stack.Screen name="SearchDetails" component={SearchScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="EventFacultyScreen" component={FacultyScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="EventProgramScreen" component={ProgramScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="EventSendingQuestionScreen" component={SendingQuestionScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="EventPollingQuestionScreen" component={PollingScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="EventEvaluationFeedbackScreen" component={FeedBackScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="EventGalleryScreen" component={GalleryScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="ForgetPassword" component={forgetPasswordScreen} options={{ headerShown: false, gestureEnabled: true }} />

            {/* Open Camera */}
            <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false, gestureEnabled: true }} />
          </Stack.Group>

        </Stack.Navigator>
      </>
    );
  }
}
