import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Appearance, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Color, Dark } from '../../config/global';
import LocalStorage from '../../storage/LocalStorage';
import DBConnect from '../../storage/DBConnect';
import LinearGradient from 'react-native-linear-gradient';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default function Header({ back, headerColor, secondColor, textColor }) {
    const navigation = useNavigation();
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(false);

    const loadAuth = async () => {
        try {
            let check = await LocalStorage.checkExist("user")
            if (check) {
                let user = await LocalStorage.getData('user');
                if (user) {
                    setName(user?.first_name);
                    setLoading(true);
                }
            } else {
                DBConnect.checkAuth();
                const time = setTimeout(async () => {
                    let user = await LocalStorage.getData('user');
                    clearTimeout(time);
                    if (user) {
                        setName(user.first_name);
                        setLoading(true);
                    }
                }, 2000);
            }

        } catch (e) {
            console.log(e);
        }
        return () => {
            user = "";
            name = "";

        }
    }
    useEffect(() => {
        loadAuth();
    }, [name]);
    return (
        <>
            <LinearGradient style={{ ...styles.header, }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 2 }} colors={[headerColor, secondColor ? secondColor : headerColor]}>
                {back ? (<>
                    <View style={styles.icon}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/img/back.png')}
                                resizeMode='contain'
                                style={{
                                    ...styles.backIcon,
                                    tintColor: Colors.white
                                }} />
                        </TouchableOpacity>
                    </View>
                </>) : (<></>)}
                <View style={styles.name}>
                    {loading ? <>
                        <Text style={{ ...styles.title, color: (textColor ? textColor : Colors.white) }}>Hi {name}!</Text></>
                        : <></>
                    }
                </View>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 90,
        width: Dimensions.get('screen').width,
        // borderBottomLeftRadius: 15,
        // borderBottomRightRadius: 15,
        position: 'relative',

        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 30,


    },
    shadowProp: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,

        elevation: 5,

    },
    icon: {
        flex: 1,
        alignItems: 'flex-start'
    },
    name: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    title: {
        color: Color.white,
        marginVertical: 15,
        fontSize: 20,
        fontFamily: "OpenSans-Bold",
        justifyContent: 'flex-end'
    },
    backIcon: {
        width: 30,
        height: 30,
    },
})