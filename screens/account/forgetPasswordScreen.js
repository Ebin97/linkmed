import { useNavigation } from '@react-navigation/native';
import React, { Component, useEffect, useRef, useState } from 'react';
import {TextInput, View, Text, StyleSheet, Button, Image, Dimensions, TouchableOpacity, Appearance, StatusBar, ScrollView } from 'react-native';
import ProgressBarLoading from '../../components/common/ProgressBar';
import { Color, Dark } from '../../config/global';
import validation from '../../config/validation';
import GeneralApiData from '../../Data/GeneralApiData';
import DBConnect from '../../storage/DBConnect';
import LocalStorage from '../../storage/LocalStorage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-toast-message';

const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default ForgetPasswordScreen = (props) => {
    const navigation = useNavigation();
    const _scrollRef = useRef();
    const [email, setEmail] = useState("");
    const [loading, isLoading] = useState(false);
    const [show, setShow] = useState(false);


    const [emailError, setEmailError] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async () => {
        if (email.trim() != "" && validation.valid(email)) {
            //Reset Variable
            setEmailError("");
            setError("");
            isLoading(true);

            //prepare data
            let data = {
                email: email,
            };
            //call API
            let res = await GeneralApiData.ForgetPassword(data);
            //hide loading
            isLoading(false);
            //processing response
            if (res.status_code == 200) {
                setShow(true);
            } else {
                setError("Error in request, please check the credentials");
            }
        } else {
            isLoading(false);
            if (email.trim() == "" || validation.valid(email)) {
                setEmailError("Email address is incorrect");
            } else {
                setPasswordError("Please type your password");
            }
        }
    }
    useEffect(() => {
        if (colorScheme === 'dark') {
            Colors = Dark
        }
    }, []);
    return (
        <>

            <StatusBar translucent barStyle={"dark-content"} backgroundColor={Colors.main_color} />
            {loading ? (<>
                <ProgressBarLoading />
            </>) : (<>
                <KeyboardAwareScrollView>

                    <ScrollView style={styles.scroll} ref={_scrollRef}>

                        <View style={styles.content}>
                            <View style={{ ...styles.center, ...styles.logoContent }}>
                                <Image style={styles.logo} resizeMode="contain" source={require('../../assets/img/logo_dark.png')} />
                            </View>
                            {error != "" ? (<>
                                <View style={styles.errorContent}>
                                    <Text style={styles.error}>{error}</Text>
                                </View>
                            </>) : (<></>)}
                            {emailError != "" ? (<>
                                <View style={styles.errorContent}>
                                    <Text style={styles.error}>{emailError}</Text>
                                </View>
                            </>) : (<></>)}


                            <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                                <View style={{ ...styles.bordered }}>
                                    <View style={styles.iconContent}>
                                        <Image style={styles.icon} resizeMode="contain" source={require('../../assets/img/user.png')} />
                                    </View>
                                    <TextInput style={styles.input}
                                        onChangeText={setEmail}
                                        cursorColor={Colors.main_color}
                                        value={email}
                                        placeholderTextColor={Colors.main_color}
                                        onFocus={() => {
                                            _scrollRef.current.scrollTo({ x: 0, y: 500 })
                                        }}
                                        placeholder="Email Address"
                                        keyboardType="email-address" />
                                </View>
                            </View>


                            <View style={styles.itemMargin}>
                                <TouchableOpacity style={styles.button}
                                    activeOpacity={.8}
                                    onPress={onSubmit}
                                >
                                    <Text style={{ ...styles.center, ...styles.buttonText }}>
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.register}>
                                <TouchableOpacity activeOpacity={.9} onPress={() => {
                                    navigation.navigate("Login", {})
                                }}>
                                    <Text style={{ ...styles.registerTitle, ...styles.bold }}>Sign In</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.medconLogo}>
                                <View>
                                    <Text style={styles.footerTitle}>Powered by</Text>
                                </View>
                                <Image
                                    source={require('../../assets/img/medcon_dark.png')}
                                    resizeMode='contain'
                                    style={{
                                        ...styles.logoCompany,
                                    }}
                                />
                            </View>
                        </View>


                    </ScrollView>
                </KeyboardAwareScrollView>


            </>)}

            <AwesomeAlert
                show={show}
                showProgress={false}
                title={"Successfully"}
                message={"The link to reset your password has been sent to your email."}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                confirmText={"Done"}
                confirmButtonColor={Colors.main_color}
                onDismiss={() => {
                    setShow(false);
                }}
                onConfirmPressed={() => {
                    navigation.navigate("Login", {})

                }}

            />
            <Toast />

        </>

    );

}
const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
    },

    content: {
        flex: 1,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    logoContent: {
    },

    logo: {
        width: 150,
    },
    center: {
        textAlign: 'center'
    },
    end: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    itemMargin: {
        marginVertical: 5,
    },
    bordered: {
        borderColor: Colors.main_color,
        borderWidth: 2,
        borderRadius: 50,
        height: 60,
        width: Dimensions.get('screen').width * .8,
        textAlign: 'center',
        color: Color.main_color,
        flexDirection: 'row',
    },

    iconContent: {
        width: Dimensions.get('screen').width * .2,
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 25,
        height: 25,
    },
    inputContent: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    input: {

        width: Dimensions.get('screen').width * .55,
        fontSize: 16,
        color: Colors.main_color,
        fontFamily: "OpenSans-Regular",

    },
    button: {
        borderColor: Colors.main_color,
        borderWidth: 2,
        borderRadius: 50,
        padding: 10,
        height: 60,
        backgroundColor: Colors.main_color,
        width: Dimensions.get('screen').width * .8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: Colors.white,
        fontFamily: "OpenSans-Bold",
    },
    linkContent: {
        width: Dimensions.get('screen').width,
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        paddingHorizontal: 50,
    },
    linkTitle: {
        color: Colors.main_color,
        fontSize: 13,
        fontFamily: "OpenSans-Regular",
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end'
    },
    register: {
        width: Dimensions.get('screen').width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20

    },
    registerTitle: {
        fontSize: 18,
        fontFamily: "OpenSans-Regular",
        paddingHorizontal: 2,
        color: Colors.main_color

    },
    bold: {
        fontFamily: "OpenSans-Bold",
    },
    errorContent: {
        paddingVertical: 10,
        justifyContent: 'center',
        alignContent: 'center'
    },
    error: {
        color: Colors.red,
        fontSize: 15,
        fontFamily: "OpenSans-Italic",
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerTitle: {
        fontSize: 12,
        color: Colors.main_color,
    },
    logoCompany: {
        width: Dimensions.get('screen').width,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: 25,
        marginTop: 8
    },
    medconLogo: {
        position: 'absolute',
        bottom: 80,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('screen').width,
    },
});
