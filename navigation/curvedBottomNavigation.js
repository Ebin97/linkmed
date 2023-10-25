import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react'
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/main/homeScreen';
import ProfileScreen from '../screens/main/profileScreen';
import NotificationScreen from '../screens/main/notificationScreen';
import PrivacyScreen from '../screens/main/privacyScreen';
import { Color } from '../config/global';
import QRCode from 'react-native-qrcode-svg';
import DBConnect from '../storage/DBConnect';
import LocalStorage from '../storage/LocalStorage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Lottie from 'lottie-react-native';

const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;
let Colors = Color;
export default function CurvedBottomNavigation() {
    const [open, setOpen] = useState(false);
    const [info, setInfo] = useState(null);
    const [loading, isLoading] = useState(true);
    const navigation = useNavigation();
    const animationRef = useRef(null)
    useFocusEffect(() => {
        init();
        const willFoucsSubsription = navigation.addListener('foucs', () => {
            init();
        })
        return willFoucsSubsription;
    });

    useEffect(() => {
        animationRef.current?.play();
    }, [])
    const init = async () => {
        DBConnect.checkAuth();
        let user = await LocalStorage.getData('user');
        let timer = setTimeout(async () => {
            clearTimeout(timer);
            setInfo(user);
            isLoading(false);
        }, 2000);
    }
    const _renderIcon = (routeName, selectedTab) => {
        let icon = '';

        if (routeName != "PrivacyScreen") {
            switch (routeName) {
                case 'HomeScreen':
                    icon = (routeName === selectedTab) ? 'ios-home' : 'ios-home-outline';
                    break;
                case 'NotificationScreen':
                    icon = (routeName === selectedTab) ? 'notifications' : 'notifications-outline';
                    break;
                case 'ProfileScreen':
                    icon = (routeName === selectedTab) ? 'person' : 'person-outline';
                    break;

            }
        } else {
            return (
                <Animated.View style={{ ...styles.iconBtnCircle, backgroundColor: Colors.transparent }}>
                    <Image
                        source={require('../assets/img/privacy.png')}
                        style={{
                            width: 40,
                            height: 40,
                        }}
                        resizeMode="contain"
                        resizeMethod='resize'
                    />
                </Animated.View>)
        }

        return (
            <Animated.View style={{ ...styles.iconBtnCircle, backgroundColor: Colors.transparent }}>
                <Ionicons
                    name={icon}
                    size={30}
                    color={Colors.white}
                />
            </Animated.View>

        );
    };

    const renderTabBar = ({ routeName, selectedTab, navigate }) => {
        return (
            <TouchableOpacity
                onPress={() => navigate(routeName)}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',

                }}>
                {_renderIcon(routeName, selectedTab)}
            </TouchableOpacity>
        );
    };
    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType='slide'
                transparent={true}
                visible={open}
                onRequestClose={() => {
                    setOpen(false)
                }}>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: Colors.modal, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        setOpen(false)
                    }}>
                    {loading || !info ? (<>
                        <ActivityIndicator color={Colors.white} size={"large"} style={{ ...styles.center, flex: 1 }} />
                    </>) : (<>
                        <QRCode
                            quietZone={12}
                            color={Colors.black}
                            backgroundColor={Colors.white}
                            size={aspectRatio > 1.6 ? 300 : 500}
                            value={info ? info.email : ""} />
                    </>)}
                </TouchableOpacity>

            </Modal>
            <CurvedBottomBar.Navigator
                style={styles.bottomBar}
                strokeWidth={0.5}
                strokeColor={Colors.main_color}
                height={55}
                circleWidth={55}
                bgColor={Colors.main_color}
                initialRouteName="HomeScreen"
                borderTopLeftRight
                renderCircle={({ selectedTab, navigate }) => (
                    <TouchableOpacity
                        style={{
                            ...styles.btnCircle,
                        }}
                        onPress={() => { setOpen(true) }}>
                        <Lottie ref={animationRef} source={require('../assets/animate/loading-qrcode.json')}
                        />

                        {/* <Ionicons name={'ios-qr-code-outline'} color={Colors.main_color} size={30} /> */}
                    </TouchableOpacity>
                )}
                tabBar={renderTabBar}>
                <CurvedBottomBar.Screen
                    name="HomeScreen"
                    position="LEFT"
                    options={{ headerShown: false }}
                    component={HomeScreen}

                />


                <CurvedBottomBar.Screen
                    name="PrivacyScreen"
                    options={{ headerShown: false }}
                    component={PrivacyScreen}

                    position="LEFT"
                />
                <CurvedBottomBar.Screen
                    name="NotificationScreen"
                    position="RIGHT"
                    options={{ headerShown: false }}
                    component={NotificationScreen}

                />

                <CurvedBottomBar.Screen
                    name="ProfileScreen"
                    position="RIGHT"
                    options={{ headerShown: false }}
                    component={ProfileScreen}
                >

                </CurvedBottomBar.Screen>
            </CurvedBottomBar.Navigator>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    button: {
        marginVertical: 5,
    },
    bottomBar: {},
    btnCircle: {
        width: 60,
        height: 60,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1,
        left: 0,
        bottom: 30,
    },
    iconBtnCircle: {

        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10,

    },
    imgCircle: {
        width: 30,
        height: 30,
        tintColor: 'gray',
    },
    img: {
        width: 30,
        height: 30,
    },
})