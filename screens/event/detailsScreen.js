import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/common/layout';
import { Color, Dark } from '../../config/global';
import GalleryImage from '../../components/common/image';
import GeneralApiData from '../../Data/GeneralApiData';
import OneSignal from 'react-native-onesignal';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient'
import Preview from '../../components/common/preview';
import RSVP from '../../components/common/rsvp';
import DBConnect from '../../storage/DBConnect';
import LocalStorage from '../../storage/LocalStorage';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;


export default function EventDetails(props) {
    const navigation = useNavigation();
    const [loading, isLoading] = useState(false);
    const [rsvp_loading, isRSVPLoading] = useState(false);
    const [event, setEvent] = useState(null);
    const [event_id, setEventID] = useState(null);
    const [items, setItems] = useState([]);
    const [rsvp, setRsvp] = useState(-1);
    const [open, setOpen] = useState(false);
    const bottomRef = useRef();

    const checkRSVP = async () => {
        bottomRef.current.show()
    }

    const init = async () => {
        try {
            isLoading(true);
            if (event_id) {
                let res = await GeneralApiData.EventDetails(event_id);
                if (res && res.status_code == 200) {
                    setEvent(res.data);
                    if (res.data.company) {
                        Colors = JSON.parse(res.data.company?.colors)
                    }
                    setRsvp(res.data.rsvp);
                    if (res.data.rsvp == -1) {
                        bottomRef?.current?.show();
                    }
                    let features = ([
                        [
                            {
                                key: 0,
                                title: "Faculty",
                                icon: require('../../assets/img/faculty.png'),
                                color: Colors.white,
                                backgroundColor: Colors.linear_main_color,
                                route: "EventFacultyScreen",
                                available: true
                            },
                            {
                                key: 1,
                                title: "Program",
                                icon: require('../../assets/img/program.png'),
                                color: Colors.white,
                                backgroundColor: Colors.linear_main_color,
                                route: "EventProgramScreen",
                                available: true

                            },
                        ],
                    ]);
                    switch (res.data?.plan) {
                        case "silver":
                            features = [
                                ...features,
                                [
                                    {
                                        key: 2,
                                        title: "Sending Questions",
                                        icon: require('../../assets/img/question.png'),
                                        color: Colors.white,
                                        backgroundColor: Colors.linear_main_color,
                                        route: "EventSendingQuestionScreen",
                                        available: res.data.isLive

                                    },
                                    {
                                        key: 3,
                                        title: "Polling Questions",
                                        icon: require('../../assets/img/polling.png'),
                                        color: Colors.white,
                                        backgroundColor: Colors.linear_main_color,

                                        route: "EventPollingQuestionScreen",
                                        available: res.data.isLive

                                    },
                                ],

                            ];
                            break;
                        case "gold": case "platinum": case "free": case "premium":
                            features = [
                                ...features,
                                [
                                    {
                                        key: 2,
                                        title: "Sending Questions",
                                        icon: require('../../assets/img/question.png'),
                                        color: Colors.white,
                                        backgroundColor: Colors.linear_main_color,
                                        route: "EventSendingQuestionScreen",
                                        available: res.data.isLive

                                    },
                                    {
                                        key: 3,
                                        title: "Polling Questions",
                                        icon: require('../../assets/img/polling.png'),
                                        color: Colors.white,
                                        backgroundColor: Colors.linear_main_color,

                                        route: "EventPollingQuestionScreen",
                                        available: res.data.isLive

                                    },
                                ], [
                                    {
                                        key: 4,
                                        title: "Evaluation Feedback",
                                        icon: require('../../assets/img/evaluation.png'),
                                        color: Colors.white,
                                        backgroundColor: Colors.linear_main_color,
                                        route: "EventEvaluationFeedbackScreen",
                                        available: res.data.isLive

                                    },
                                    {
                                        key: 5,
                                        title: "Gallery",
                                        icon: require('../../assets/img/gallery.png'),
                                        color: Colors.white,
                                        backgroundColor: Colors.linear_main_color,
                                        route: "EventGalleryScreen",
                                        available: res.data.isLive

                                    },
                                ]

                            ];
                            break;
                        default:
                            break;
                    }
                    setItems(features)
                }

                isLoading(false);
                await DBConnect.checkEvent(res.data?.id);
                await DBConnect.checkRSVP(res.data?.id);

                let check = await LocalStorage.getData('event');
                if (check?.id) {
                    setOpen(false);
                } else {
                    setOpen(true);
                    await DBConnect.insertTrackingInfo(res.data?.id, res.data?.title, true);
                }
                return () => {
                    check = "";
                    res = "";
                };
            }

        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        setEventID(props.route.params.event);
        init();


        return () => {

        }
    }, [event_id]);
    useEffect(() => {
        OneSignal.setNotificationOpenedHandler(async (openedEvent) => {
            const { action, notification } = openedEvent;
            if (notification.additionalData != undefined) {
                let target = notification.additionalData;
                switch (target.type) {
                    case "event":
                        navigation?.navigate("EventDetails", {
                            event: target.id
                        })
                        break;
                    default:
                        break;
                }
            }
        })

        return () => {

        }
    }, [])



    return (

        <>
            {loading ? (<>
                <View style={styles.container}>
                    <ActivityIndicator size={"large"} />
                </View>
            </>) : (<>
                <Layout
                    back={true}
                    headerColor={Colors.main_color}
                    secondColor={Colors.main_color}
                    textColor={Colors.white}
                    onRefresh={init}
                    refreshing={loading}
                    naviagationAction={
                        () => {
                            navigation?.goBack()
                        }
                    }
                >

                    <RSVP setRsvp={setRsvp} event={event} rsvp={rsvp} bottomRef={bottomRef} isRSVPLoading={isRSVPLoading} rsvp_loading={rsvp_loading} />

                    {event ? (<>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={[Colors.white, Colors.white]}>
                            <View style={styles.center}>
                                <Text style={{ ...styles.title, ...styles._margin, color: Colors.grey_color }}>
                                    {event.title}
                                </Text>
                            </View>
                            <View style={styles.rowItem}>
                                <View style={styles.colItem}>
                                    <GalleryImage defaultStyle={{
                                        ...styles.logo,
                                        ...styles.center,
                                    }} url={event.logo} size={"contain"} />
                                </View>
                                <View style={styles.colItem}>
                                    <View style={{ ...styles.rowItem }}>
                                        <Image source={require('../../assets/img/date.png')}
                                            resizeMode='contain'
                                            style={{
                                                ...styles.smallIcon,
                                                tintColor: Colors.main_color
                                            }} />
                                        <View style={{ ...styles.split, backgroundColor: Colors.main_color }}>
                                        </View>
                                        <Text style={{ ...styles.time }}>
                                            {event ? event.event_start : ""}
                                        </Text>

                                    </View>

                                    <View style={{ ...styles.rowItem }}>
                                        <Image source={require('../../assets/img/time.png')}
                                            resizeMode='contain'
                                            style={{
                                                ...styles.smallIcon,
                                                tintColor: Colors.main_color

                                            }} />
                                        <View style={{ ...styles.split, backgroundColor: Colors.main_color }}>
                                        </View>
                                        <Text style={{ ...styles.time }}>
                                            {event ? event.time : ""}
                                        </Text>
                                    </View>
                                    <View style={{ ...styles.rowItem }}>
                                        <Image source={require('../../assets/img/location.png')}
                                            resizeMode='contain'
                                            style={{
                                                ...styles.smallIcon,
                                                tintColor: Colors.main_color

                                            }} />
                                        <View style={{ ...styles.split, backgroundColor: Colors.main_color }}>
                                        </View>
                                        <TouchableOpacity activeOpacity={.9} onPress={() => {
                                            Linking.openURL(event.location);

                                        }}>
                                            <Text style={{ ...styles.location }}>
                                                {event ? event.address : ""}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>

                        <Text style={styles.description}>
                            {event ? event.description : ""}
                        </Text>
                        <TouchableOpacity style={styles.flex} activeOpacity={.9} onPress={checkRSVP}>
                            <View>
                                {rsvp == 1 ? (<>
                                    <Text style={styles.rsvp}>
                                        I will attend this event
                                    </Text>
                                </>) : (rsvp == 0 ? (<>
                                    <Text style={styles.rsvp}>
                                        I will not attend this event
                                    </Text>
                                </>) : (
                                    rsvp == 2 ? <>
                                        <Text style={styles.rsvp}>
                                            I am not sure
                                        </Text>
                                    </> : (<>
                                        <Text style={styles.rsvp}>

                                        </Text>
                                    </>)))}
                            </View>
                            {rsvp != -1 ?
                                <Text style={{ ...styles.rsvpChange, color: Colors.main_color, borderColor: Colors.main_color, backgroundColor: Colors.white }}>
                                    Change
                                </Text>
                                : <>

                                    <Text style={{ ...styles.rsvpChange, color: Colors.main_color, borderColor: Colors.main_color, backgroundColor: Colors.white }}>
                                        RSVP
                                    </Text>

                                </>
                            }
                        </TouchableOpacity>


                        {items && items.map((row, key) => {
                            return (<View key={key}>
                                <View style={styles.row}>
                                    {row.map((item, key1) => {
                                        return <View key={key1} style={{ borderWidth: 1, borderColor: item.color }}>

                                            <TouchableOpacity onPressIn={() => {

                                            }} key={key1} onPress={() => {
                                                if (item.available || event.plan == "free") {
                                                    navigation.navigate(item.route, {
                                                        event: event,
                                                        colors: Colors
                                                    })
                                                } else {

                                                    Toast.show({
                                                        type: "error",
                                                        text1: "Warning",
                                                        text2: (!event.hasEnded ? "The Event is not live yet" : "The Event has ended")
                                                    })
                                                }
                                            }} activeOpacity={1} style={{ ...styles.col, borderColor: Colors.main_color }}>
                                                <Image source={item.icon}
                                                    resizeMode='contain'
                                                    style={{
                                                        ...styles.icon,
                                                        tintColor: Colors.main_color

                                                    }} />
                                                <Text style={{ ...styles._margin, ...styles.text, color: Colors.main_color }}>{item.title}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    })}
                                </View>
                            </View>)
                        })}
                        {event && event.promo ? (<>
                            <Preview event={event} url={event.promo} open={open} setOpen={setOpen} />
                        </>) : (<></>)}
                    </>) : (null)}
                </Layout>
            </>)
            }
            <Toast />

        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    center: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    description: {
        fontSize: aspectRatio > 1.6 ? 14 : 18,
        marginHorizontal: 15,
        marginVertical: 10,
        fontFamily: "OpenSans-Regular",
        color: Colors.grey_color
    },
    title: {
        fontSize: aspectRatio > 1.6 ? 20 : 25,
        marginHorizontal: 15,
        fontFamily: "OpenSans-ExtraBoldItalic",
        color: Colors.main_color,
        textAlign: 'center'
    },
    time: {
        fontSize: aspectRatio > 1.6 ? 12 : 16,
        paddingLeft: 5,
        paddingRight: 10,
        fontFamily: "OpenSans-BoldItalic",
        color: Colors.grey_color
    },
    location: {
        fontSize: aspectRatio > 1.6 ? 12 : 16,
        paddingLeft: 5,
        paddingRight: 30,
        fontFamily: "OpenSans-BoldItalic",
        color: Colors.grey_color,
    },
    row: {
        flexDirection: "row",
        borderColor: Colors.main_color,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    start: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center'
    },
    col: {
        flexDirection: 'column',
        width: Dimensions.get('screen').width * .48,
        height: Dimensions.get('screen').width * .48,
        borderWidth: 2,
        borderColor: Colors.main_color,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        margin: 2,
    },
    smallIcon: {
        width: 30,
        height: 30,
    },
    icon: {
        height: 80,
    },
    logo: {
        height: 80,
        width: Dimensions.get('screen').width * .5,
    },
    Icons: {
        width: "25%",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    backIcon: {
        width: 30,
        height: 30,
    },
    _margin: {
        marginVertical: 10,
        marginHorizontal: 15,

    },
    leftBorder: {
        borderLeftWidth: 2,
        borderLeftColor: Colors.main_color
    },
    split: {
        width: 2,
        height: "100%",
        marginHorizontal: 10,
        backgroundColor: Colors.main_color
    },
    text: {
        color: Colors.main_color,
        textTransform: 'uppercase',
        fontFamily: "OpenSans-ExtraBold",
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: aspectRatio > 1.6 ? 16 : 20,

    },
    rowItem: {
        flexDirection: 'row',
        width: Dimensions.get('screen').width * .41,
        alignContent: 'center',
        paddingVertical: 5,
        paddingEnd: 5
    },
    colItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'

    },

    rsvp: {
        width: width * .7,
        paddingHorizontal: 15,
        marginVertical: 10,
        color: Colors.grey_color,
        fontFamily: "OpenSans-BoldItalic",
        textDecorationLine: 'underline',
        textTransform: 'uppercase',

    },
    rsvpChange: {
        width: width * .25,
        fontFamily: "OpenSans-BoldItalic",
        color: Colors.grey_color,
        alignItems: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: Colors.main_color,
        paddingVertical: 10,
        borderRadius: 20,
        marginVertical: 10,
        fontSize: 16,

    },


    flex: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    bottomTitle: {
        marginTop: 20,
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: Colors.grey_color,
        fontFamily: "OpenSans-BoldItalic",

    },



});
