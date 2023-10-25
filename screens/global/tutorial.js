import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider'
export default function Tutorial() {
    const slides = [
        {
            key: "",
            title:"",
            text:"",
            image:require('../../assets/img/tutorial/1.png'),
            imageStyle:styles.image,
            background:'#59b2ab'
        }
    ];
    return (
        <>
            <AppIntroSlider

            >

            </AppIntroSlider>
        </>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 320
    }
})