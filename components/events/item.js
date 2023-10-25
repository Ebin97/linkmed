import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import ComponentEvent from './component.event';

export default function EventItem(props) {




    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={.96} onPress={() => {
                    if (props.user && props.user.isScanner) {
                        props.navigation.navigate("Scanner", {
                            event: props.event.id
                        })
                    } else {
                        props.navigation.navigate("EventDetails", {
                            event: props.event.id
                        })
                    }
                }}>

                    <ComponentEvent event={props.event} />

                </TouchableOpacity>

            </View>
        </>
    );

}



const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * .95,
        position: 'relative',
    },
   
});