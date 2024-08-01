import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OneSignal from 'react-native-onesignal';
import WebView from 'react-native-webview';
import Layout from '../../components/common/layout';
import { Color, Dark } from '../../config/global';
import GeneralApiData from '../../Data/GeneralApiData';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');

export default function PollingScreen(props) {
    const [loading, isLoading] = useState(false);
    const [event, setEvent] = useState(null);
    const [eventPolling, setEventPolling] = useState(null);


    const init = async () => {
        isLoading(true);
        let time = setTimeout(async () => {
            clearTimeout(time);
            if (event && event.id != 0) {
                const res = await GeneralApiData.EventPolling(event ? event.id : 0);
                isLoading(false);
                if (res && res.status_code == 200) {
                    console.log(res.data)
                    setEventPolling(res.data);
                } else {
                    setEventPolling(null);
                }
            }
        }, 2000);
    }
    useEffect(() => {
        setEvent(props.route.params.event);
        Colors = props.route.params.colors
        init();
    }, [event]);
    useEffect(() => {
        OneSignal.setNotificationOpenedHandler(async (openedEvent) => {
            const { action, notification } = openedEvent;
            if (notification.additionalData != undefined) {
                let target = notification.additionalData;
                switch (target.type) {
                    case "event":
                        props?.navigation?.navigate("EventDetails", {
                            event: target.id
                        })
                        break;
                    default:
                        break;
                }
            }
        })

    }, [])
    return (
        <Layout back={true}
        headerColor={Colors.main_color}
        secondColor={Colors.main_color}
            onRefresh={init}
            naviagationAction={
                () => {
                    props?.navigation?.goBack()
                }
            }
            refreshing={loading}>
            {loading ? (<>
                <ActivityIndicator />
            </>) : (<>

                {eventPolling ? (<>
                    <WebView
                        originWhitelist={['*']}
                        source={{ uri: eventPolling.url }}
                        style={styles.frame}
                    />
                </>) : (<View style={styles.container}>
                    <View style={styles.center}>
                        <Text style={{
                            color: Colors.grey_color,
                            fontFamily: "OpenSans-Bold",
                            textAlign: 'center',
                            fontSize: 16,
                        }}>Polling is not available now</Text>
                    </View>
                </View>)}

            </>)}

        </Layout>
    );
}

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        paddingTop: 10, paddingBottom: 50,
        width: width,
        height: height * .9
    },
    container: {
        flex: 1,
        height: height,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});