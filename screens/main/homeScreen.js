import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { View, Text, ScrollView, StatusBar, Appearance, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Color, Dark } from '../../config/global';
import GeneralApiData from '../../Data/GeneralApiData';
import OneSignal from 'react-native-onesignal';
import Layout from '../../components/common/layout';
import LocalStorage from '../../storage/LocalStorage';
import EventItem from '../../components/events/item';
import SearchBar from '../../components/common/searchbar';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

export default function HomeScreen(props) {
    const navigation = useNavigation();
    const [loading, isLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);


    const search = async () => {
        navigation.navigate("SearchDetails", {
            searchPhrase: searchPhrase
        })
    }

    const init = async () => {
        isLoading(true);
        let time = setTimeout(async () => {
            let user = await LocalStorage.getData('user');
            setUser(user);
            clearTimeout(time);
            let player = await OneSignal.getDeviceState();

            let data = {
                page: 0,
                fcm: player.userId
            }
            const res = await GeneralApiData.EventList(data);
            isLoading(false);
            if (res && res.status_code == 200) {
                if (res.data.length > 0) {
                    setEvents(res.data);
                    setPage(page + 1);
                } else {
                    setPage(0);
                }
            } else {
                setEvents([]);
            }
        }, 2000);
    }
    useEffect(() => {
        // init();

        const foucsHanler = navigation.addListener('focus', () => {
            init();
        })
        return foucsHanler;
    }, [navigation])

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
    return (<>
        <StatusBar translucent barStyle={"dark-content"} backgroundColor={Colors.main_color} />

        <Layout onRefresh={() => {
            setPage(0);
            init();
        }} refreshing={loading}
            naviagationAction={
                () => {
                    // props?.navigation?.goBack()
                }
            }
        >
            <View style={{
                ...styles.center, ...styles.lists,
            }}>
                <Text style={styles.title}>My Events</Text>

                <View style={styles.search}>
                    <SearchBar
                        searchPhrase={searchPhrase}
                        setSearchPhrase={setSearchPhrase}
                        clicked={clicked}
                        setClicked={setClicked}
                        search={search}
                        description={true}
                    />

                </View>
                <Text style={styles.title}>Coming Event</Text>
                <View style={styles.divider}></View>
                <View style={{ paddingBottom: 40 }}>
                    {loading ? (<>
                        <ActivityIndicator />
                    </>) : (<>
                        {events && events.length > 0 ? (<>
                            {events.length > 0 && events.map((item, key) => {
                                return (<View key={key} style={styles.item}>
                                    <EventItem colors={item.company.colors} event={item} user={user} navigation={props.navigation} />
                                </View>
                                )
                            })}
                        </>) : (<>
                            <View style={styles.content}>
                                <Text style={styles.noItems}>No upcoming event</Text>
                            </View>
                        </>)}


                    </>)}
                </View>
            </View>
        </Layout>
    </>
    );

}
const styles = StyleSheet.create({
    title: {
        color: Colors.dark_blue_color,
        width: Dimensions.get('screen').width,
        textAlign: 'center',
        marginVertical: 5,
        fontSize: aspectRatio > 1.6 ? 22 : 26,
        fontFamily: "OpenSans-Bold",
        textTransform: 'capitalize',
    },
    center: {
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center'
    },
    content: {
        minHeight: Dimensions.get('screen').height * .5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noItems: {
        color: Colors.grey_color,
        width: Dimensions.get('screen').width,
        textAlign: 'center',
        marginVertical: 5,
        fontSize: aspectRatio > 1.6 ? 14 : 18,
        fontFamily: "OpenSans-Bold",

    },
    lists: {
        minHeight: Dimensions.get('screen').height * .5,
        flex: 1,
        marginTop: 20,
    },
    item: {
        marginVertical: 10,
        shadowColor: Colors.main_color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2
    },
    marginItem: {
        marginBottom: 10
    },
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },

    divider: {
        marginVertical: 10,
        width: '80%',
        height: 2,
        backgroundColor: Colors.main_color
    },


});