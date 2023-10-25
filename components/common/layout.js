import React, { useRef } from 'react';
import { Animated, Appearance, Dimensions, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import Header from './header';
import { Color, Dark } from '../../config/global';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;

export default function Layout(props) {

    const scrollX = useRef(new Animated.Value(0)).current;
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };
    return (
        <>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.main_color} />
            <View style={{ backgroundColor: Colors.white, flex: 1 }}>
                <Header
                    textColor={props.textColor}
                    back={props.back}
                    headerColor={props.headerColor ? props.headerColor : Colors.main_color}
                    secondColor={props.secondColor ? props.secondColor : Colors.main_color} />
                <ScrollView
                    pagingEnabled={false}
                    onScroll={Animated.event([
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: scrollX
                                }
                            }
                        }
                    ], { useNativeDriver: false })}
                    scrollEventThrottle={0}
                    refreshControl={
                        <RefreshControl refreshing={props.refreshing} onRefresh={props.onRefresh} />
                    }
                    contentContainerStyle={{ paddingBottom: 40 }} style={styles.scroll} >
                    <GestureRecognizer
                        onSwipeRight={(state) => props?.naviagationAction()}
                    >
                        <View style={styles.container}>
                            {props.children}
                        </View>
                    </GestureRecognizer>
                </ScrollView>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    scroll: {
        backgroundColor: Colors.white,
    },
    container: {
        backgroundColor: Color.white,
        flexDirection: 'column',
        width: Dimensions.get('screen').width,
        // marginTop: 10,
        backgroundColor: Colors.white
    },
});
