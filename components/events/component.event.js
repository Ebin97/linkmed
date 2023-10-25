import React, { useEffect } from 'react';
import { Appearance, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color, Dark } from '../../config/global';
import GalleryImage from '../common/image';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

function ComponentEvent({ event }) {

    useEffect(() => {
        if (event?.company) {
            Colors = JSON.parse(event?.company?.colors)
        }
    }, [])

    return (
        <View style={{ ...styles.row, ...styles.item, backgroundColor: Colors.linear_main_color, borderColor: Colors.linear_main_color }}>
            <LinearGradient style={{ ...styles.details, }} start={{ x: 1, y: 0 }} end={{ x: .5, y: 1 }} angleCenter={{ x: 0, y: 0 }} colors={[Colors.white, Colors.white]}>

                <View style={{
                    margin: 5,

                }}>

                    <View style={styles.col}>
                        <View style={{
                            ...styles.rowFlex, justifyContent: 'center',
                        }}>
                            <View>
                                <Text style={{ ...styles._font20, ...styles._center, color: Colors.main_color }}>{event.day}</Text>
                                <Text style={{ ...styles._font40, ...styles._center, color: Colors.main_color }}>{event.day_numeric}</Text>
                                <Text style={{ ...styles._font20, ...styles._center, color: Colors.main_color }}>{event.month}</Text>
                            </View>
                        </View>
                        <View style={{ ...styles.rowFlex, }}>
                            <View style={styles.iconContent}>
                                <Image source={require('../../assets/img/time.png')}
                                    resizeMode='contain'
                                    style={{
                                        ...styles.icon,
                                        tintColor: Colors.main_color,

                                    }} />
                            </View>
                            <View style={styles.textContent}>
                                <Text style={{ ...styles._font12,  color: Colors.main_color, }}>{event.time}</Text>
                            </View>
                        </View>
                        <View style={{ ...styles.rowFlex, }}>
                            <View style={styles.iconContent}>
                                <Image source={require('../../assets/img/location.png')}
                                    resizeMode='contain'
                                    style={{
                                        ...styles.icon,
                                        height: 40,
                                        tintColor: Colors.main_color

                                    }} />
                            </View>
                            <View style={styles.textContent}>
                                <Text style={{ ...styles._font10,  color: Colors.main_color }}>{event.address}</Text>

                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
            <View>

                <GalleryImage defaultStyle={{
                    ...styles.thumb,
                }} url={event.cover} size={"stretch"} />
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * .95,
        position: 'relative',
    },
    item: {
        backgroundColor: Colors.white
    },
    row: {
        width: Dimensions.get('screen').width * .955,
        borderWidth: 3,
        borderColor: Colors.main_color,
        borderRadius: 15,
        flexDirection: 'row',
    },
    col: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 1
    },
    rowFlex: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    details: {
        width: Dimensions.get('screen').width * .40,
        height: aspectRatio > 1.6 ? 200 : Dimensions.get('screen').height * .25,
        borderRadius: 3,
        elevation: 5,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        shadowColor: "#000000",
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: Colors.white,
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    iconContent: {
        width: "20%",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 20,
    },
    textContent: {
        width: "80%",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    _center: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    thumb: {
        height: aspectRatio > 1.6 ? 200 : Dimensions.get('screen').height * .25,
        width: Dimensions.get('screen').width * .54,
        backgroundColor: Colors.white,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,

    },
    _margin5: {
        marginVertical: 5
    },
    _margin10: {
        marginVertical: 10
    },
    _margin15: {
        marginVertical: 15
    },
    _font8: {
        fontSize: aspectRatio > 1.6 ? 8 : 10,
        color: Colors.main_color,
        fontFamily: "OpenSans-Regular",
        textTransform: 'capitalize',
        lineHeight: aspectRatio > 1.6 ? 8 : 10,
        width: "100%",

    },
    _font10: {
        fontSize: aspectRatio > 1.6 ? 10 : 15,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",
        lineHeight: aspectRatio > 1.6 ? 10 : 15,
        width: "100%",

    },
    _font12: {
        fontSize: aspectRatio > 1.6 ? 12 : 14,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",
        textTransform: 'uppercase',
        lineHeight: aspectRatio > 1.6 ? 12 : 14,
        width: "100%",

    },
    _font15: {
        fontSize: aspectRatio > 1.6 ? 15 : 17,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",
        textTransform: 'capitalize',
        lineHeight: aspectRatio > 1.6 ? 15 : 17,
        width: "100%",
        marginBottom: 5

    },
    _font18: {
        fontSize: aspectRatio > 1.6 ? 18 : 20,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",
        textTransform: 'capitalize',
        lineHeight: aspectRatio > 1.6 ? 18 : 20,
        width: "100%",
    },
    _font20: {
        fontSize: aspectRatio > 1.6 ? 20 : 25,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",
        textTransform: 'uppercase',
        lineHeight: aspectRatio > 1.6 ? 20 : 25,
        width: "100%",

    },
    _font50: {
        fontSize: aspectRatio > 1.6 ? 45 : 47,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",
        textTransform: 'capitalize',
        lineHeight: aspectRatio > 1.6 ? 45 : 47,
        width: "100%",

    },
    _font40: {
        fontSize: aspectRatio > 1.6 ? 35 : 37,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",
        textTransform: 'capitalize',
        lineHeight: aspectRatio > 1.6 ? 35 : 37,
        width: "100%",

    },
});
export default ComponentEvent;