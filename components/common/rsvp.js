import React, { useState } from 'react';
import { ActivityIndicator, Appearance, Dimensions, StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import { Color } from '../../config/global';
const colorScheme = Appearance.getColorScheme();
let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;
import RNCalendarEvents from 'react-native-calendar-events'
import GeneralApiData from '../../Data/GeneralApiData';
import Toast from 'react-native-toast-message';
import DBConnect from '../../storage/DBConnect';
import LocalStorage from '../../storage/LocalStorage';
import WellDone from './welldone';
function RSVP({ event, bottomRef, setRsvp, rsvp, isRSVPLoading, rsvp_loading,color_}) {


    const [addToCalendar, setAddToCalendar] = useState(false);
    const [show, setShow] = useState(false);
    // RSVP(event.id) 

    const checkCalendarPermission = async () => {
        RNCalendarEvents.checkPermissions((readOnly = false)).then(async (fullfilled, rejected) => {
            console.log(fullfilled);
            if (fullfilled == 'authorized') {
                permissionGranted();
            } else {
                RNCalendarEvents.requestPermissions((readOnly = false)).then((fullfilled, rejected) => {
                    console.log(fullfilled);
                    if (fullfilled == 'authorized') {
                        permissionGranted();
                    }
                })
            }
        })
    }
    const permissionGranted = async () => {
        await DBConnect.checkRSVP(event.id)
        let savedId = await LocalStorage.getData('rsvp');
        let id = savedId ? savedId?.rsvp_id : null
        if (id) {
            await RNCalendarEvents.findEventById(id, {
                exceptionDate: event.startDate,
            }).then((fullfilled, rejected) => {
                console.log("Permission granted RSVP");
                console.log("Remove from the list");
                addEventReminder();

            }).catch(() => console.log(id));
        } else {
            addEventReminder();
        }
    }
    const addEventReminder = async () => {
        setShow(false);
        await removeEventReminder();
        RNCalendarEvents.saveEvent(event.title, {
            id: event.id,
            CalendarId: "Event-No." + event.id,
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location,
            timeZone: 'Asia/Dubai',
            alarms: [
                {
                    date: 0
                },
                {
                    date: 15
                },
                {
                    date: 60
                },
            ]
        }).then(async (fullfilled, rejected) => {
            await DBConnect.insertRSVPInfo(event.id, fullfilled)
            bottomRef.current.close();
            setShow(true);
            let timer = setTimeout(() => {
                setShow(false);
            }, 5000);

        });
    }


    return (
        <>
            <WellDone show={show} />

            <BottomSheet hasDraggableIcon ref={bottomRef} height={200} >
                {addToCalendar ? (<>
                    <Text style={styles.bottomTitle}>Save the date</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity style={{ ...styles.selected, backgroundColor: Colors.main_color, borderColor: Colors.main_color }} onPress={() => {
                            checkCalendarPermission();
                        }}>
                            <Text style={styles.rsvpTitleColored}>Add to calendar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...styles.option, borderColor: Colors.main_color }} onPress={() => {
                            bottomRef.current.close()
                            setAddToCalendar(false);
                        }}>
                            <Text style={{ ...styles.rsvpTitle, color: Colors.main_color }}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>

                </>) : (<>
                    <Text style={styles.bottomTitle}>Please confirm</Text>
                    {rsvp_loading ? (<>
                        <ActivityIndicator />
                    </>) : (<>
                        <View style={styles.actions}>
                            <TouchableOpacity style={rsvp != 1 ? { ...styles.option, borderColor: color_ } : { ...styles.selected, backgroundColor: Colors.main_color, borderColor: Colors.main_color }} onPress={() => {
                                if (rsvp != 1) {
                                    updateRSVP(1);
                                } else {
                                    //setAddToCalendar(true);
                                }
                            }}>
                                <Text style={rsvp != 1 ? { ...styles.rsvpTitle, color: color_ } : styles.rsvpTitleColored}>Attending</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={rsvp != 0 ? { ...styles.option, borderColor: color_ } : { ...styles.selected, backgroundColor: Colors.main_color, borderColor: Colors.main_color }} onPress={() => {
                                if (rsvp != 0) {
                                    updateRSVP(0);
                                } else {
                                    // setAddToCalendar(false);
                                    // removeEventReminder();
                                }
                            }}>
                                <Text style={rsvp != 0 ? { ...styles.rsvpTitle, color: color_ } : styles.rsvpTitleColored}>Not Attending</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={rsvp != 2 ? { ...styles.option, borderColor: color_ } : { ...styles.selected, backgroundColor: Colors.main_color, borderColor: Colors.main_color }} onPress={() => {
                                if (rsvp != 2) {
                                    updateRSVP(2);
                                } else {
                                    // setAddToCalendar(false);
                                    // removeEventReminder();

                                }
                            }}>
                                <Text style={rsvp != 2 ? { ...styles.rsvpTitle, color:color_ } : styles.rsvpTitleColored}>Not Sure</Text>
                            </TouchableOpacity>
                        </View>
                    </>)}
                </>)}
            </BottomSheet>

        </>
    );
}
const styles = StyleSheet.create({
    actions: {
        marginTop: 20,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottomTitle: {
        marginTop: 20,
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: Colors.grey_color,
        fontFamily: "OpenSans-BoldItalic",
    },
    selected: {
        padding: 10,
        backgroundColor: Colors.main_color,
        marginHorizontal: 5,
        borderRadius: 20,
        color: Colors.white,
        borderWidth: 1,
        borderColor: Colors.main_color,
        fontFamily: "OpenSans-BoldItalic",
    },
    rsvpTitle: {
        color: Colors.main_color,
    },
    rsvpTitleColored: {
        color: Colors.white
    },
    option: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 20,
        color: Colors.main_color,
        borderWidth: 1,
        borderColor: Colors.main_color,
        fontFamily: "OpenSans-BoldItalic",
    },
});
export default RSVP;