import React from 'react';
import { Appearance, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Color, Dark } from '../../config/global';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default function NotificationItem({ item }) {
    //url , id for kind of notification
    const onPress = async () => {
    }
    return (
        <TouchableOpacity
            activeOpacity={.9}
            onPress={onPress} style={styles.container}>
            <Text style={styles.title}>{item.title}</Text>
            <View>
                <Text style={styles.time}>{item.created_at}</Text>
            </View>
            <Text style={styles.message}>{item.details}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 10,
        flexDirection: 'column',
        marginHorizontal: 20
    },
    time: {
        color: Colors.grey_color,
        fontSize: 12,
        flexDirection: 'row',
        fontFamily: "OpenSans-Bold",
        marginBottom: 20
    },
    title: {
        color: Colors.main_color,
        fontSize: 16,
        fontFamily: "OpenSans-SemiBold",
    },
    message: {
        color: Colors.grey_color,
        fontSize: 16,
        fontFamily: "OpenSans-Regular",
    },

});