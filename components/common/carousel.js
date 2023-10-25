import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Carousel from 'react-native-reanimated-carousel'
import { Color } from '../../config/global';
import GalleryImage from './image';
let Colors = Color;

const { width, height } = Dimensions.get('screen');

export default function CarouselImage({ data, index, setOpen, open }) {
    return (
        <Modal animationType='slide'
            transparent={true}
            visible={open}
            onRequestClose={() => {
                setOpen(false)
            }} >

            <Carousel
                width={width}
                height={height}
                autoPlay={false}
                defaultIndex={index}
                style={{ flex: 1, backgroundColor: Colors.modal }}
                data={data}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => { console.log(index) }}
                renderItem={(obj) => {
                    return <View style={{ justifyContent: 'centert', alignItem: 'center', justifyContent: 'center' }}>
                        <GalleryImage size={"contain"} defaultStyle={{ height: height }} url={obj.item.url} />
                    </View>
                }}
            />
            <TouchableOpacity style={styles.close} onPress={() => {
                setOpen(false)
            }}>
                <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    close: {
        position: 'absolute',
        top: 40,
        right: 20,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: Colors.white,

    },
    closeText: {
        paddingHorizontal: 12,
        paddingVertical: 8,

    }
})