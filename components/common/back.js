import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Appearance, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Color, Dark } from '../../config/global';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default function Back(props) {
    const navigation = useNavigation();

    return (
        <>
            <View style={{ ...styles.header, ...styles.shadowProp }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/img/back.png')}
                        resizeMode='contain'
                        style={{
                            ...styles.backIcon
                        }} />
                </TouchableOpacity>
            </View>
        </>
    );
}
const styles = StyleSheet.create({

    header: {
        backgroundColor: Colors.main_color,
        height: Dimensions.get('screen').height * .15,
        width: Dimensions.get('screen').width,
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    shadowProp: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 10,

    },
    backIcon: {
        width: 30,
        height: 30,
    },
});
