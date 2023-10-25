import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, Image, PermissionsAndroid, Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Color, Dark } from '../../config/global';
import { FloatingAction } from "react-native-floating-action";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import GeneralApiData from '../../Data/GeneralApiData';
import GalleryImage from '../../components/common/image';
import Header from '../../components/common/header';
import ModalImage from '../../components/common/modal';
import Toast from 'react-native-toast-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import OneSignal from 'react-native-onesignal';
import Layout from '../../components/common/layout';
import { FlatGrid } from 'react-native-super-grid';
import LinearGradient from 'react-native-linear-gradient';
import CarouselImage from '../../components/common/carousel';
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;
let Colors = Color;

export default function GalleryScreen(props) {
    const [loading, isLoading] = useState(true);
    const [loadMore, isLoadMore] = useState(false);
    const [event, setEvent] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [page, setPage] = useState(1);
    const [show, setShow] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setEvent(props.route.params.event);
        let time = setTimeout(async () => {
            clearTimeout(time);
            loadGallery();
        }, 2000);
        return () => {
            setGallery([]); // This worked for me
        };
    }, [event]);
    useEffect(() => {
        Colors = props.route.params.colors
    }, []);
    const refresh = async () => {
        setPage(1);
        loadGallery();
    }
    const loadGallery = async (more) => {
        if (more) {
            isLoadMore(true);
        } else {
            isLoading(true);
        }
        setShow(false);

        if (event && event.id > 0) {
            let data = {
                page: page,
            };
            let res = await GeneralApiData.EventLoadGallery(event.id, data)
            // setPage(page + 1);
            if (res && res.status_code == 200) {
                setGallery(res.data);
                if (more) {
                    setPage(page + 1)
                } else {
                    setPage(1)
                }
            }
            if (more) {
                isLoadMore(false);
            } else {
                isLoading(false);
            }
        }

    }
    const asyncLaunchCamera = async () => {
        const result = await launchCamera({
            mediaType: "photo",
            durationLimit: 20,
            saveToPhotos: true,
            cameraType: "back",
            includeExtra: true,
            maxHeight: 1920,
            maxWidth: 1080,
        });
        if (result && result.assets) {
            let form = new FormData();
            let files = [];
            result.assets.forEach(photo => {
                let uri = photo.uri;
                if (Platform.OS === 'ios') {
                    uri = uri.replace('file://', '');
                }
                form.append('images[]', {
                    name: photo.fileName,
                    type: photo.type,
                    uri: uri,
                });

            });
            form.append('images[]', (files))
            //show loading
            isLoading(true);
            let res = await GeneralApiData.EventUploadLiveGallery(event.id, form);
            if (res && (res.status_code == 200 || res.status == 200)) {
                setShow(true);
            } else {
                Toast.show({
                    type: "error",
                    text1: "Error!",
                    text2: "Something wrong, Please try again"
                });
                setShow(false);
            }
            //hide loading
            isLoading(false);
        }
    }
    useEffect(() => {
        OneSignal.setNotificationOpenedHandler(async (openedEvent) => {
            const { action, notification } = openedEvent;
            if (notification.additionalData != undefined) {
                let target = notification.additionalData;
                switch (target.type) {
                    case "event":
                        props?.navigation?.navigate("EventDetails", {
                            event: target.id
                        })
                        break;
                    default:
                        break;
                }
            }
        })

    }, [])
    const openCamera = async () => {


        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await asyncLaunchCamera();

            } else {
                // if get here, the user did NOT accepted the permissions
                Toast.show({
                    type: "error",
                    text1: "Warning!",
                    text2: "Something wrong, Access Denied"
                });
            }
        } else {
            await asyncLaunchCamera();
        }


    }
    const asyncLaunchImageLibrary = async () => {
        try {

            const result = await launchImageLibrary({
                mediaType: "photo",
                durationLimit: 20,
                selectionLimit: 5,
                maxHeight: 1920,
                maxWidth: 1080,
                includeExtra: true,
            });
            if (result.didCancel) {
                console.log('User cancelled image picker');
            } else if (result.error) {
                console.log('ImagePicker Error: ', result.error);
            } else if (result.customButton) {
                console.log('User tapped custom button: ', result.customButton);
            } else {
                //show loading
                isLoading(true);
                let form = new FormData();
                result.assets.forEach(photo => {
                    let uri = Platform.OS === 'android'
                        ? photo.uri
                        : photo.uri.replace('file://', '')
                    form.append('images[]', {
                        name: photo.fileName,
                        type: photo.type,
                        uri: uri,
                    });

                });
                let res = await GeneralApiData.EventUploadLiveGallery(event.id, form);
                if (res && (res.status_code == 200 || res.status == 200)) {
                    setShow(true);

                } else {
                    Toast.show({
                        type: "error",
                        text1: "Error!",
                        text2: "Something wrong, Please try again"
                    });
                    setShow(false);
                }
                isLoading(false);

                //hide loading


            }
        } catch (e) {
            isLoading(false);

            console.log('User tapped custom button: ', e);
        }
    }
    const openGallery = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    await asyncLaunchImageLibrary();
                }
            } else {
                await asyncLaunchImageLibrary();
            }
        } catch (e) {
            isLoading(false);

            console.log('User tapped custom button: ', e);
        }
    }

    return (
        <>
            {gallery.length > 0 ? (<>
                <StatusBar barStyle={"light-content"} backgroundColor={Colors.main_color} />
                <View style={styles.scroll}>
                    <Header back={true}
                        headerColor={props.headerColor ? props.headerColor : Colors.main_color}
                        secondColor={props.secondColor ? props.secondColor : Colors.main_color}
                        textColor={Colors.white}

                    />
                    <View style={styles.container}>
                        {loading ? (<>
                            <View style={styles.center}>
                                <ActivityIndicator />
                            </View>
                        </>) : (<>
                            {/* <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={[Colors.white, Colors.white, Colors.white, Colors.white]}> */}

                            <FlatGrid

                                style={{ flex: 1, }}
                                spacing={5}
                                itemDimension={120}
                                onRefresh={refresh}
                                refreshing={loading}
                                initialNumToRender={15}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={(distanceFromEnd) => {
                                    if (distanceFromEnd > -50) {
                                        loadGallery(true);
                                    }
                                }}
                                data={gallery}
                                renderItem={(({ item, index }) => {
                                    return <TouchableOpacity onPress={() => {
                                        setSelectedImg(index);
                                        setOpen(true)
                                    }}>
                                        <GalleryImage defaultStyle={{ height: 130, }} url={item.url} />
                                    </TouchableOpacity>
                                })}
                            />
                            {loadMore ? (<>
                                <View style={{ marginVertical: 50, justifyContent: "center" }}>
                                    <ActivityIndicator size={'large'} />
                                </View>
                            </>) : (<></>)}
                            {/* </LinearGradient> */}
                        </>)}

                    </View>
                </View>
                <CarouselImage data={gallery} index={selectedImg ? selectedImg : 1} open={open} setOpen={setOpen} />
            </>) : (<>
                <Layout back={true}
                    headerColor={props.headerColor ? props.headerColor : Colors.main_color}
                    secondColor={props.secondColor ? props.secondColor : Colors.main_color}
                    textColor={Colors.white}
                    naviagationAction={
                        () => {
                            props?.navigation?.goBack()
                        }
                    }
                    onRefresh={refresh} refreshing={loading}>
                    {loading ? (<>
                        <View style={styles.container}>
                            <ActivityIndicator />
                        </View>
                    </>) : (<>
                        <View style={styles.container}>
                            <Text style={styles.noItems}>No Images Found</Text>
                        </View>
                    </>)}
                </Layout>
            </>)}
            <FloatingAction
                buttonSize={70}
                iconHeight={30}
                iconWidth={30}
                actions={[{
                    text: "Camera",
                    icon: require("../../assets/img/camera.png"),
                    color: Colors.main_color,
                    name: "camera",
                    buttonSize: 45,
                    position: 2
                },
                {
                    text: "Gallery",
                    icon: require("../../assets/img/file.png"),
                    name: "gallery",
                    color: Colors.main_color,
                    buttonSize: 45,
                    position: 1
                },]}
                color={Colors.main_color}
                dismissKeyboardOnPress={true}
                style={styles.flatbtn}
                onPressItem={name => {
                    if (name == "camera") {
                        openCamera();
                    } else {
                        openGallery()
                    }
                }}
            />
            <AwesomeAlert
                show={show}
                showProgress={false}
                title={"Successfully"}
                message={"Your photo has been submitted, it will be available after review"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                confirmText={"Done"}
                confirmButtonColor={Colors.main_color}
                onDismiss={() => {
                    setShow(false);
                }}
                onConfirmPressed={() => {
                    loadGallery()
                }}

            />
            <Toast />

        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Colors.white,
        height: height,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    scroll: {
        flex: 1,
        flexDirection: 'column',
    },



    flatbtn: {
        position: 'absolute',
        bottom: 0,
    },
    gridView: {
        marginTop: 10,
        flex: 1,
        borderWidth: 1
    },
    noItems: {
        color: Colors.grey_color,
        fontFamily: "OpenSans-Bold",
        textAlign: 'center',
        fontSize: 16,

    },
    button: {
        backgroundColor: Colors.main_color,
        width: 200,
        height: 50,
        borderRadius: 20,
        marginTop: 20
    },
    center: {

        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    white: {
        color: Colors.white,
        fontFamily: "OpenSans-Bold",
        fontSize: aspectRatio > 1.6 ? 18 : 22,

    },
});

