import React, { useEffect, useRef } from 'react';

import Lottie from 'lottie-react-native';
import { Animated, Appearance, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
const { height, width } = Dimensions.get('window');

function WellDone({ show }) {
    const animateRef = useRef(null)
    useEffect(()=>{
        console.log(show);
    },[])

    return (
        show ? (<>
            <View style={{ flex: 1, position: 'absolute', top: 0, height: height, width: width, backgroundColor: 'transparent' }}>

                <Lottie ref={animateRef} source={require('../../assets/animate/well-done.json')} autoPlay={show} loop />
            </View>
        </>) : (null)
    );
}

export default WellDone;