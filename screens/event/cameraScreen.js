import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Appearance, Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import { Color, Dark } from '../../config/global';

const colorScheme = Appearance.getColorScheme();
let Colors = Color;


export default function Camera(props) {
    const navigation = useNavigation();
    const [event, setEvent] = useState(null);
    useEffect(() => {
        setEvent(props.route.params.event);
    }, []);
    const onBottomButtonPressed = (evt) => {
        console.log(evt);
    }
    return (
        <>
            <View style={{ backgroundColor: Colors.white, flex: 1 }}>

                <View style={{ ...styles.header, ...styles.shadowProp }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/img/back.png')}
                            resizeMode='contain'
                            style={{
                                ...styles.backIcon
                            }} />
                    </TouchableOpacity>
                </View>
                <CameraScreen
                    actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
                    onBottomButtonPressed={(evt) => onBottomButtonPressed(evt)}
                />
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    scroll: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        backgroundColor: Colors.main_color,
        height: Dimensions.get('screen').height * .1,
        width: Dimensions.get('screen').width,
        // borderBottomLeftRadius: 30,
        // borderBottomRightRadius: 30,
        position: 'relative',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',


    },
    header_title: {
        color: Color.white,
        width: Dimensions.get('screen').width * .8,
        fontSize: 20,
        fontFamily: "OpenSans-Bold",
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',

    },
    backIcon: {
        width: 30,
        height: 30,
    },
});
