import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Appearance, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Color, Dark } from '../../config/global';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Camera } from 'react-native-vision-camera';
import GeneralApiData from '../../Data/GeneralApiData';
import validation from '../../config/validation';
import { useNavigation } from '@react-navigation/native';

const colorScheme = Appearance.getColorScheme();
let Colors = Color;
export default function QrScannerScreen(props) {
    const navigation = useNavigation();

    const [hasPermission, setHasPermission] = useState(false);
    const [data, setData] = useState("");
    const [loading, isLoading] = useState(false);
    const [active, setActive] = useState(true);

    let scanner = useRef();



    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
        })();
    }, []);
    const submit = async (value) => {
        isLoading(true);
        setActive(false);
        let timer = setTimeout(async () => {
            clearTimeout(timer);
            if (validation.valid(value.data)) {
                let data = {
                    email: value.data
                };
                let res = await GeneralApiData.EventAttended(1, data);

                if (res && res.status_code == 200) {
                    alert("Success");
                } else {
                    alert("Error!,Please try again");

                }
            }
            setActive(true);
            isLoading(false)
            //  scanner.reactivate();
        }, 1000);
    }

    return (
        <>

            {
                loading ? (<>
                    <ActivityIndicator size={"large"} />
                </>) : (
                    hasPermission && (<>

                        <QRCodeScanner
                            ref={(node) => { scanner = node }}
                            onRead={(e) => {
                                submit(e)
                            }}
                            containerStyle={styles.container}
                            cameraContainerStyle={styles.cameraContainerStyle}
                            cameraStyle={styles.cameraStyle}
                            reactivate={true}
                            reactivateTimeout={5000}

                            showMarker={true}
                            checkAndroid6Permissions={true}

                            topContent={
                                <View style={styles.header}>
                                    <View style={styles.icon}>
                                        <TouchableOpacity onPress={() => {
                                            navigation.goBack()
                                        }}>
                                            <Image source={require('../../assets/img/back.png')}
                                                resizeMode='contain'
                                                style={styles.backIcon} />
                                        </TouchableOpacity>

                                    </View>
                                    
                                </View>
                            }
                            bottomContent={
                                <View style={styles.center}>
                                    <Image style={styles.logo} resizeMode="contain" source={require('../../assets/img/medcon_logo.png')} />
                                </View>
                            }

                        />
                    </>)
                )}
        </>
    )
}
const styles = StyleSheet.create({
    center: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    container: {
        backgroundColor: Colors.main_color
    },
    header: {
        height: 100,
        width: Dimensions.get('screen').width,
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative'
    },
    logo: {
        width: 150,
        height: 80,
    },
    backIcon: {
        width: 40,
        height: 40,
        marginLeft:20
      
    },
    cameraContainerStyle: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',

    },
    cameraStyle: {
        height: Dimensions.get('screen').height * .7,
    }

});