import React, { useEffect, useState } from 'react';
import { Appearance, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Color, Dark } from '../../../config/global';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

export default function FacultyItem({ item, colors }) {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Colors = colors
        setLoading(false);
    }, [])

    return (
        <View style={styles.content}>
            {loading ? (<></>) : (<>
                <View style={styles.profileContent}>
                    <Image resizeMode='contain' source={{ uri: item.profile }} style={{ ...styles.profile, borderColor: Colors.main_color }} />
                </View>
                <View style={styles.col}>
                    <Text style={{ ...styles.name, color: Colors.main_color }}>{item.first_name + " " + item.last_name}</Text>
                    <Text style={styles.details}>{item.profession}</Text>
                </View>
            </>)}
        </View>
    );
}
const styles = StyleSheet.create({
    content: {
        width: Dimensions.get('screen').width,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        alignItems: 'center'

    },
    profileContent: {
        width: Dimensions.get('screen').width * .3,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    profile: {
        width: aspectRatio > 1.6 ? 80 : 120,
        height: aspectRatio > 1.6 ? 80 : 120,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: Colors.main_color
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    col: {
        width: Dimensions.get('screen').width * .7,
        paddingEnd: 20,
        flexDirection: 'column',
    },
    name: {
        fontSize: aspectRatio > 1.6 ? 16 : 20,

        color: Colors.main_color
    },
    details: {
        fontSize: aspectRatio > 1.6 ? 12 : 16,
        color: Colors.grey_color,
    }

});