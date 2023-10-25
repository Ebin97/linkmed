import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/homeScreen';
const Tab = createBottomTabNavigator();
import { Color, Dark } from '../config/global';
import { Appearance, Dimensions, Image } from 'react-native';
import NotificationScreen from '../screens/main/notificationScreen';
import PrivacyScreen from '../screens/main/privacyScreen';
import ProfileScreen from '../screens/main/profileScreen';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('screen');
const aspectRatio = height / width;

export default function BottomNavigation(props) {
    return (
        <Tab.Navigator
            backBehavior='history'
            initialRouteName='HomeScreen'
            screenOptions={({ navigation, route }) => ({
                tabBarStyle: {
                    backgroundColor: Colors.main_color,
                    borderTopRightRadius: 25,
                    borderTopLeftRadius: 25,
                },

                tabStyle: {

                },
                tabBarIcon: ({ focused, color, size }) => {

                    if (route.name === 'HomeScreen') {
                        return <Image
                            source={!focused ? require('../assets/img/outline_home.png') : require('../assets/img/home.png')}
                            style={{ height: size * 1.3, width: size * 1.3, resizeMode: "contain" }} />;
                    } else if (route.name === 'PrivacyScreen') {
                        return <Image
                            source={!focused ? require('../assets/img/outline_privacy.png') : require('../assets/img/privacy.png')}
                            style={{ height: size * 1.3, width: size * 1.3, resizeMode: "contain" }} />;
                    } else if (route.name === 'NotificationScreen') {
                        return <Image
                            source={!focused ? require('../assets/img/outline_bell.png') : require('../assets/img/bell.png')}
                            style={{ height: size * 1.3, width: size * 1.3, resizeMode: "contain" }} />;
                    } else if (route.name === 'ProfileScreen') {
                        return <Image
                            source={!focused ? require('../assets/img/outline_profile.png') : require('../assets/img/profile.png')}
                            style={{ height: size * 1.3, width: size * 1.3, resizeMode: "contain" }} />;
                    }

                },
                options: {

                },
                tabBarActiveTintColor: Colors.transparent,
                tabBarInactiveTintColor: Colors.transparent,
                tabBarLabel: () => { return null },
                tabBarLabelStyle: {
                    borderWidth: 1
                }
            })}>
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="PrivacyScreen" component={PrivacyScreen} options={{ headerShown: false }} />
            <Tab.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />

        </Tab.Navigator>
    );
}

