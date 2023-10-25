import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import { RefreshControl } from 'react-native-gesture-handler';
import OneSignal from 'react-native-onesignal';
import NotificationItem from '../../components/notification/item';
import { Color, Dark } from '../../config/global';
import GeneralApiData from '../../Data/GeneralApiData';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default function NotificationScreen(props) {
    const navigation = useNavigation();
    const [loading, isLoading] = useState(true);
    const [page, setPage] = useState(1);
    const bottomRef = useRef();
    const [notifications, setNotifications] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const init = async () => {

        isLoading(true);
        let data = {
            page: page
        }
        let res = await GeneralApiData.Notification(data);
        if (res && res.status_code == 200) {
            setNotifications(res.data);
        }
        isLoading(false);
    }
    const deleteNotification = async () => {
        isLoading(true);
        let res = await GeneralApiData.DeleteNotification(1);
        if (res.status_code == 200) {
            init();
        }
        this.bottomRef.close();
        isLoading(false);
    }
    useEffect(() => {
        OneSignal.setNotificationOpenedHandler(async (openedEvent) => {
            const { action, notification } = openedEvent;
            if (notification.additionalData != undefined) {
                let target = notification.additionalData;
                switch (target.type) {
                    case "event":
                        navigation.navigate("EventDetails", {
                            event: target.id
                        })
                        break;
                    default:
                        break;
                }
            }
        })

    }, [])

    useEffect(() => {
        init();
    }, []);
    return (
        <>
            <SafeAreaView style={styles.container}>
                <BottomSheet hasDraggableIcon ref={bottomRef} height={150} >
                    <View style={styles.actions}>
                        {selectedItem ? (<>
                            <Text style={styles.bottomTitle}>{selectedItem.title}</Text>
                            <TouchableOpacity onPress={() => {
                                deleteNotification(selectedItem.id)
                            }} activeOpacity={.8} style={styles.inline}>
                                <View style={styles.icon} >
                                    <Image style={styles.removeIcon} source={require('../../assets/img/remove.png')} />
                                </View>
                                <Text style={styles.remove}>Remove this notification</Text>
                            </TouchableOpacity>
                        </>) : (<></>)}
                    </View>
                </BottomSheet>
                <StatusBar translucent barStyle={"light-content"} backgroundColor={Colors.main_color} />

                <View style={styles.header}>
                    <Text style={styles.title}>Notifications</Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 40, flex: 1 }} refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={init} />
                } style={styles.scroll}>

                    {notifications && notifications.length > 0 ? (<>
                        {notifications.map((item, key) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={.9}
                                    key={key}
                                    onLongPress={() => {
                                        setSelectedItem(item)
                                        bottomRef.current.show()
                                    }}>
                                    <NotificationItem item={item} />
                                </TouchableOpacity>
                            )
                        })}
                    </>) : (<>
                        <Text style={styles.noItems}>No new notifications</Text>

                    </>)}


                </ScrollView>
            </SafeAreaView>

        </>
    );
}
const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        flexDirection: 'column',
    },
    container: {
        flex: .98,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: Colors.main_color,
        paddingTop: 50

    },
    header: {
        alignItems: 'center',

    },
    title: {
        fontSize: 30,
        color: Colors.white,
        textTransform: "uppercase",
        fontFamily: "OpenSans-Bold",
        marginVertical: 10,
    },
    actions: {
        padding: 15
    },
    remove: {
        textAlign: 'center',
        fontFamily: "OpenSans-Bold",
        color: Colors.grey_color,
        fontSize: 14,
        textAlign: 'center',
        alignItems: 'center',
        padding: 10

    },
    bottomTitle: {
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.grey_color,
        fontFamily: "OpenSans-Bold",
        textAlign: 'center',

    },
    icon: {
        alignItems: 'center',
        backgroundColor: Colors.light_grey_color,
        padding: 8,
        borderRadius: 20
    },
    removeIcon: {
        height: 25,
        width: 25,
    },
    inline: {
        flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'center',
        paddingTop: 15
    },
    noItems: {
        color: Colors.grey_color,
        fontFamily: "OpenSans-Bold",
        textAlign: 'center',

    }
});