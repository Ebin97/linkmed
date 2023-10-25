import React, { Component } from 'react';
import { Modal, View, Text, ActivityIndicator, Button, Appearance } from 'react-native';
import { Color, Dark } from '../../config/global';
const colorScheme = Appearance.getColorScheme();

let Colors = Color;


export default function ProgressBarLoading({ visible }) {
    if (colorScheme === 'dark') {
        Colors = Dark
    }
    return (
        <Modal transparent onRequestClose={() => null} visible={visible}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ borderRadius: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'white', padding: 25 }}>
                    <Text style={{ fontWeight: 'bold', color: Colors.grey_color }}>Please Wait </Text>
                    <ActivityIndicator color={Colors.dark_blue_color} size="small" />
                </View>
            </View>
        </Modal>
    );

}
