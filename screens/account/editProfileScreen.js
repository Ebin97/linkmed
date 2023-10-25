import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Color, Dark } from '../../config/global';
import data from "../../Data/countries.json"
import GeneralApiData from '../../Data/GeneralApiData';

import Toast from 'react-native-toast-message';
import DBConnect from '../../storage/DBConnect';
import LocalStorage from '../../storage/LocalStorage';
import AwesomeAlert from 'react-native-awesome-alerts';
import OneSignal from 'react-native-onesignal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

const colorScheme = Appearance.getColorScheme();
let Colors = Color;


export default function EditProfileScreen(props) {
    const navigation = useNavigation();
    const _scrollRef = useRef();

    const [countries, setCountries] = useState([]);
    const [show, setShow] = useState(false);
    const [specialities, setSpecialities] = useState([]);

    const [isFocus, setIsFocus] = useState(false);

    const [loading, isLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [speciality, setSpeciaity] = useState("");



    // Init Function for get all specialities 
    const getSpecialities = async () => {
        isLoading(true);


        const res = await GeneralApiData.SprcialityFunction();
        let user = await LocalStorage.getData('user');

        if (res && res.status_code == 200) {
            let data = [];
            res.data.forEach(item => {
                if (item.title == user.speciality) {
                    setSpeciaity({
                        title: item.title,
                        value: item.id
                    });
                }
                data.push({
                    value: item.id,
                    label: item.title
                });
            });
            setSpecialities(data);

        } else {
            setSpecialities([]);
        }
        isLoading(false);
    }
    const handleOnChangeText = async (content, key) => {
        setInfo({
            ...info,
            [key]: content
        });

    }
    // To Generate picker options 

    const generateData = (data) => {
        const newData = Object.keys(data).reduce((result, currentKey) => {
            if (typeof data[currentKey] === 'string' || data[currentKey] instanceof String) {
                result.push({
                    label: data[currentKey],
                    value: data[currentKey]
                });
            } else {
                const nested = generateData(data[currentKey]);
                result.push(...nested);
            }
            return result;
        }, []);
        return newData;
    }
    const deleteAccount = async () => {
        setShow(true);
    }
    const confirmDelete = async () => {
        isLoading(true);
        setShow(false);
        let res = await GeneralApiData.DeleteUserInfoFunction(info.id);
        if (res && res.status_code == 200) {
            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Your account is deleted successfully"
            })
        }
        DBConnect.deleteData();
        await LocalStorage.trancateData('user');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        })
        // isLoading(false);
    }
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

    }, [])
    const update = async () => {
        let data = {
            id: info.id,
            first_name: info.first_name,
            last_name: info.last_name,
            country: info.country,
            speciality_id: speciality.value,

        };
        console.log(data);

        if (info.first_name == ""
        ) {
            Toast.show({
                type: "error",
                text1: "The information is incorrect",
                text2: "Please type correct First Name"
            })
            return false;
        }
        if (info.last_name == ""
        ) {
            Toast.show({
                type: "error",
                text1: "The information is incorrect",
                text2: "Please type correct Last Name"
            })
            return false;
        }
        if (info.country == ""
        ) {
            Toast.show({
                type: "error",
                text1: "The information is incorrect",
                text2: "Please choose your country"
            })
            return false;
        }
        if (info.speciality_id == ""
        ) {
            Toast.show({
                type: "error",
                text1: "The information is incorrect",
                text2: "Please choose your speciality"
            })
            return false;
        }
        if (((info.password && info.password != "") || (info.confirm_password && info.confirm_password != ""))) {
            if (data.confirm_password != data.password) {
                Toast.show({
                    type: "error",
                    text1: "The information is incorrect",
                    text2: "Password and confirm password does not match"
                })
                return false;
            } else {
                data = {
                    ...data,
                    password: info.password,
                    confirm_password: info.confirm_password
                }
            }
        }
        isLoading(true);
        let res = await GeneralApiData.UpdateUserInfoFunction(data, info.id);
        console.log(res);
        if (res && res.status_code == 200) {
            let user = res.data
            await DBConnect.insertData(user.id, user.first_name, user.last_name, user.email, user.country, user.speciality, user.profession, user.token, user.is_activated, false, user.created_at);
            await DBConnect.getByEmail(user.email);

            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Your Information updated successfully"
            })
        } else {
            Toast.show({
                type: "error",
                text1: "Error in request, Please try again"
            })
        }
        isLoading(false);
    }
    useEffect(() => {
        let res = generateData(data);
        setCountries(res);
    }, [data]);
    useEffect(() => {
        DBConnect.checkAuth();
        let timer = setTimeout(async () => {
            clearTimeout(timer);
            let user = await LocalStorage.getData('user');
            setInfo(user)
            if (user) {
                await getSpecialities();

            }
        }, 2000)
    }, []);
    return (
        <>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.main_color} />
            <View style={styles.container}>
                <KeyboardAwareScrollView>

                    <ScrollView contentContainerStyle={{ paddingBottom: 40, flex: 1 }} style={styles.scroll} ref={_scrollRef}>
                        <View style={styles.header}>
                            <View style={styles.icon}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Image source={require('../../assets/img/back.png')}
                                        resizeMode='contain'
                                        style={{
                                            ...styles.backIcon
                                        }} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.title}>My Profile</Text>
                        </View>
                        {loading ? (<>
                            <ActivityIndicator color={Colors.white} size={"large"} style={{ ...styles.center, flex: 1 }} />
                        </>) : (<>
                            <View style={styles.details}>

                                <Text style={styles.headerTitle}>Personal Details</Text>

                                <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                                    <TextInput style={styles.input}
                                        onChangeText={(first_name) => { handleOnChangeText(first_name, 'first_name') }}
                                        placeholderTextColor={Colors.white}
                                        cursorColor={Colors.white}
                                        value={info.first_name}
                                        onFocus={() => {
                                            _scrollRef.current.scrollTo({ x: 0, y: 500 })
                                        }}
                                        placeholder="First Name"
                                    />
                                </View>

                                <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                                    <TextInput style={styles.input}
                                        onChangeText={(last_name) => { handleOnChangeText(last_name, 'last_name') }}
                                        placeholderTextColor={Colors.white}
                                        cursorColor={Colors.white}
                                        value={info.last_name}
                                        onFocus={() => {
                                            _scrollRef.current.scrollTo({ x: 0, y: 500 })
                                        }}
                                        placeholder="Last Name"
                                    />
                                </View>

                                <View style={{ ...styles.itemMargin, ...styles.inputContent }}>

                                    <TextInput style={{ ...styles.input, color: Colors.main_color, backgroundColor: '#e8e8e8' }}
                                        onChangeText={(email) => { handleOnChangeText(email, 'email') }}
                                        placeholderTextColor={Colors.white}
                                        cursorColor={Colors.white}
                                        editable={false} selectTextOnFocus={false}
                                        value={info.email}
                                        placeholder="Email Address"
                                        keyboardType="email-address" />
                                </View>

                                <View style={{ ...styles.itemMargin, ...styles.inputContent }}>

                                    <Dropdown
                                        style={[styles.dropdown]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        iconColor={Colors.white}
                                        itemTextStyle={{color:"black"}}
                                        data={countries}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? 'Country' : '...'}
                                        searchPlaceholder="Search..."
                                        value={info.country}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={item => {
                                            handleOnChangeText(item.value, 'country')
                                            setIsFocus(false);
                                        }}

                                    />
                                </View>
                                <Text style={{ ...styles.itemMargin, ...styles.headerTitle }}>Professional Details</Text>


                                <View style={{ ...styles.itemMargin, ...styles.inputContent }}>

                                    <Dropdown
                                        style={[styles.dropdown]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        iconColor={Colors.white}
                                        data={specialities}
                                        itemTextStyle={{color:"black"}}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? 'Speciality' : '...'}
                                        searchPlaceholder="Search..."
                                        value={speciality}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={item => {
                                            setSpeciaity(item)
                                            setIsFocus(false);
                                        }}
                                    />
                                </View>
                                <Text style={{ ...styles.itemMargin, ...styles.headerTitle }}>Password</Text>

                                <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                                    <TextInput style={styles.input}
                                        onChangeText={(password) => { handleOnChangeText(password, 'password') }}
                                        placeholderTextColor={Colors.white}
                                        cursorColor={Colors.white}
                                        value={info.password}
                                        onFocus={() => {
                                            _scrollRef.current.scrollTo({ x: 0, y: 500 })
                                        }}
                                        placeholder="Password"
                                        secureTextEntry={true} />

                                </View>

                                <View style={{ ...styles.itemMargin, ...styles.inputContent }}>
                                    <TextInput style={styles.input}
                                        onChangeText={(confirm_password) => { handleOnChangeText(confirm_password, 'confirm_password') }}
                                        placeholderTextColor={Colors.white}
                                        cursorColor={Colors.white}
                                        value={info.confirm_password}
                                        onFocus={() => {
                                            _scrollRef.current.scrollTo({ x: 0, y: 500 })
                                        }}
                                        placeholder="Confirm Password"
                                        secureTextEntry={true} />
                                </View>

                                <View style={{ ...styles.actions, ...styles.center }}>
                                    <TouchableOpacity style={styles.button}
                                        activeOpacity={.8}
                                        onPress={update}>
                                        <Text style={{ ...styles.center, ...styles.buttonText }}>
                                            Update
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ ...styles.button, ...styles.delete }}
                                        activeOpacity={.8}
                                        onPress={deleteAccount}>
                                        <Text style={{ ...styles.center, ...styles.buttonText, ...styles.red }}>
                                            Delete Account
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                        )}

                    </ScrollView>
                </KeyboardAwareScrollView>
            </View>
            <AwesomeAlert
                show={show}
                showProgress={false}
                title={"Delete Account"}
                message={"Are your sure!"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText={"No, cancel"}
                confirmText={"Yes, delete it"}
                confirmButtonColor="#DD6B55"
                onDismiss={() => {
                    setShow(false);
                }}
                onCancelPressed={() => {
                    setShow(false);
                }}
                onConfirmPressed={() => {
                    confirmDelete()
                }}

            />
            <Toast />
        </>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        flexDirection: 'column',
        position: 'relative',

    },
    container: {
        flex: 1,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: Colors.main_color,
        borderBottomEndRadius: 40,
        borderBottomStartRadius: 40,
        paddingTop: 50

    },
    header: {
        height: 100,
        width: Dimensions.get('screen').width,
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        flex: .9,
        fontSize: 30,
        color: Colors.white,
        textTransform: "uppercase",
        fontFamily: "OpenSans-Bold",
        marginVertical: 10,
        justifyContent: 'center',
        textAlign: 'center',
    },
    details: {
        marginHorizontal: 20
    },
    headerTitle: {
        color: Colors.white,
        fontFamily: "OpenSans-SemiBold",
        fontSize: aspectRatio > 1.6 ? 18 : 25,
    },
    inputContent: {

        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    itemMargin: {
        marginVertical: 5,
    },
    input: {
        width: Dimensions.get('screen').width * .8,
        fontSize: aspectRatio > 1.6 ? 16 : 23,
        color: Colors.white,
        fontFamily: "OpenSans-Regular",
        borderWidth: 3,
        borderColor: Colors.white,
        borderRadius: 50,
        height: aspectRatio > 1.6 ? 50 : 70,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bordered: {
        borderWidth: 1,
    },
    white: {
        color: Colors.white,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        height: aspectRatio > 1.6 ? 50 : 70,
        width: Dimensions.get('screen').width * .8,
        borderColor: Colors.white,
        borderWidth: 2,
        borderRadius: 50,
        paddingHorizontal: 20,
        color: Colors.white
    },
    placeholderStyle: {
        fontSize: aspectRatio > 1.6 ? 16 : 23,
        color: Colors.white

    },
    selectedTextStyle: {
        fontSize: aspectRatio > 1.6 ? 16 : 23,
        color: Colors.white
    },
    iconStyle: {
        width: 20,
        height: 20,


    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: Colors.grey_color
    },
    button: {
        borderColor: Colors.white,
        borderWidth: 2,
        borderRadius: 50,
        padding: 10,
        height: aspectRatio > 1.6 ? 50 : 70,
        backgroundColor: Colors.white,
        width: Dimensions.get('screen').width * .8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: aspectRatio > 1.6 ? 16 : 23,
        color: Colors.main_color,
        fontFamily: "OpenSans-Bold",
        textTransform: 'uppercase'
    },
    red: {
        color: Colors.red
    },
    icon: {
        flex: .1,
        alignItems: 'flex-start'
    },
    backIcon: {
        width: 30,
        height: 30,
    },
    delete: {
        marginTop: 30,
    },
    error: {
        color: Colors.red
    }
});