import React, { useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, Image, StyleSheet, View } from 'react-native';
import { Color, Dark } from '../../config/global';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default function GalleryImage({ defaultStyle, url, size }) {
    const [loading, isLoading] = useState(false);

    return (
        <>
            <Image style={{...defaultStyle}}
                resizeMode={size ? size : "cover"}
                resizeMethod={"resize"}
                onLoadStart={() => {
                    isLoading(true);
                }}
                onLoadEnd={() => {
                    isLoading(false);
                }} source={{ uri: url }} />
            {loading ? (<>
                <View style={styles.spinner}>
                    <ActivityIndicator />
                </View>
            </>) : (<></>)}
        </>
    );
}

const styles = StyleSheet.create({

    spinner: {
        position: 'absolute',
        width: "100%",
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: Colors.placeHolder,
        borderRadius: 5
    },
   
});