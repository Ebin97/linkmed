import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, Appearance, StyleSheet, Dimensions, Image, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import OneSignal from 'react-native-onesignal';
import Layout from '../../components/common/layout';
import { Color, Dark } from '../../config/global';
import GeneralApiData from '../../Data/GeneralApiData';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default function PrivacyScreen(props) {
    const [loading, isLoading] = useState(true);
    const [data, setData] = useState(null);

    const init = async () => {
        isLoading(true);
        const res = await GeneralApiData.PrivacyFunction();
        if (res && res.status_code == 200) {
            setData(res.data);
        }
        isLoading(false);
    }
    useEffect(() => {
        init();
    }, []);
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
    return (
        <>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.main_color} />
            <View style={styles.container}>
                <Layout back={false} onRefresh={init} refreshing={loading} contentContainerStyle={{ paddingBottom: 100 }} style={styles.scroll}
                    naviagationAction={
                        () => {
                            // props?.navigation?.goBack()
                        }
                    }
                >
                    <Text style={styles.title}>LinkMed</Text>
                    {loading && !data ? (<>
                        <ActivityIndicator />
                    </>) : (<>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Image resizeMode='contain' style={styles.icon} source={require("../../assets/img/mission.png")} />
                                <View >
                                    <Text style={styles.subtitle}>Mission</Text>
                                    <Text style={styles.description}>{data.mission ? data.mission : ""}</Text>
                                </View>
                            </View>
                            <View style={{ ...styles.col }}>
                                <Image resizeMode='contain' style={styles.icon} source={require("../../assets/img/vision.png")} />
                                <View style={{ ...styles.bordered }}>
                                    <Text style={styles.subtitle}>Vision</Text>
                                    <Text style={styles.description}>{data.vission ? data.vission : ""}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...styles.row, ...styles.center }}>
                            <View>
                                <Text style={styles.subtitle}>Privacy Policy</Text>
                                <Text style={styles.description} numberOfLines={13} ellipsizeMode={"tail"}>{data.privacy ? data.privacy : ""}</Text>
                                <TouchableOpacity onPress={() => {
                                    Linking.openURL("https://medcon-me.com")
                                }}>
                                    <Text style={styles.showMore}>Read More</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ ...styles.center, ...styles.contact_info }}>
                            <Text style={styles.subtitle}>Contact Information</Text>
                            <View style={{ ...styles.inline, }}>
                                <Image resizeMode='contain' style={styles.smallIcon} source={require("../../assets/img/phone.png")} />
                                <TouchableOpacity onPress={() => {
                                    if (data.contact.phone != "") {
                                        Linking.canOpenURL(`tel:${data.contact.phone}`).then(supported => {
                                            if (supported) {
                                                Linking.openURL(`tel:${data.contact.phone}`).
                                                    catch(err => console.log("Error!!"));
                                            }
                                        }).catch(err => console.log("Error!!"));
                                    }
                                }} activeOpacity={0.9}>
                                    <Text style={styles.value}>{data.contact.phone}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ ...styles.inline, }}>
                                <Image resizeMode='contain' style={styles.smallIcon} source={require("../../assets/img/chat.png")} />
                                <TouchableOpacity onPress={() => {
                                    if (data.contact.phone != "") {

                                        Linking.canOpenURL(`whatsapp://send?phone=${data.contact.phone.replace(" ", "")}`).then(supported => {
                                            if (supported) {
                                                Linking.openURL(`whatsapp://send?phone=${data.contact.phone.replace(" ", "")}`).
                                                    catch(err => console.log("Error!!"))
                                            }
                                        }).catch(err => console.log("Error!!"));

                                    }
                                }} activeOpacity={0.9}>

                                    <Text style={styles.value}>{data.contact.chatPhone}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ ...styles.inline, }}>
                                <Image resizeMode='contain' style={styles.smallIcon} source={require("../../assets/img/location.png")} />
                                <TouchableOpacity onPress={() => {
                                    if (data.contact.location != "") {
                                        Linking.openURL(data.contact.location);
                                    }
                                }} activeOpacity={0.9}>
                                    <Text style={styles.value}>{data.contact.address}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ ...styles.inline, }}>
                                <Image resizeMode='contain' style={styles.smallIcon} source={require("../../assets/img/mail.png")} />
                                <Text style={styles.value}>{data.contact.email}</Text>
                            </View>
                        </View>

                    </>)}
                </Layout>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        marginBottom: 30
    },
    title: {
        color: Colors.main_color,
        width: Dimensions.get('screen').width,
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 22,
        fontFamily: "OpenSans-Bold",
        textTransform: 'uppercase',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: Color.main_color,
        borderBottomWidth: 2,
        marginHorizontal: 10,
    },
    inline: {
        flex: .5,
        width: '90%',
        flexDirection: 'row',
        borderBottomColor: Color.main_color,
        paddingVertical: 10,
    },
    col: {
        flex: .5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    smallIcon: {
        height: 30,
        width: 30,

    },
    bordered: {
        borderLeftWidth: 2,
        borderLeftColor: Colors.main_color,
    },

    subtitle: {
        textAlign: 'center',
        marginTop: 15,
        fontSize: 18,
        fontFamily: "OpenSans-Bold",
        color: Colors.main_color,
        textTransform: 'uppercase',


    },
    contact_info: {
        marginHorizontal: 20
    },
    description: {
        paddingHorizontal: 15,
        marginVertical: 10,
        color: Colors.grey_color
    },
    showMore: {
        paddingHorizontal: 15,
        marginBottom: 10,
        color: Colors.dark_grey_color,
        fontSize: 12,
        fontFamily: "OpenSans-BoldItalic",
        textAlign: 'right'
    },
    value: {
        fontSize: 15,
        color: Colors.grey_color,
        paddingHorizontal: 30,
        fontFamily: "OpenSans-Regular",

    }
});