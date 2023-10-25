
import React, { useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Color, Dark } from '../../config/global';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default function ModalImage({ url, defaultStyle }) {
    const [loading, isLoading] = useState(false);
    const [modal, setModal] = useState(false);


    return (
        <>
            <View
                animationType="slide"
                transparent={true}
                style={styles.container}
                visible={modal}>
                <Image style={styles.image} onLoadEnd={() => { isLoading(false) }} onLoadStart={() => { isLoading(true) }} resizeMode={"center"} source={{ uri: url }} />
                {loading ? (<>
                    <View style={styles.spinner}>
                        <ActivityIndicator size={"large"} />
                    </View>
                </>) : (<></>)}
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.modal,
        position: 'relative',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: "100%",
        height: Dimensions.get('screen').height
    },
    spinner: {
        position: 'absolute',
        width: "100%",
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: Colors.placeHolder,
        borderRadius: 20
    },
});