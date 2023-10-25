import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, Text, Dimensions,TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Color } from "../../config/global";

let Colors = Color;
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;


const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked, search, description }) => {
    return (
        <View style={styles.center}>
            <View style={styles.container}>
                <View
                    style={
                        clicked
                            ? styles.searchBar__clicked
                            : styles.searchBar__unclicked
                    }
                >
                    {/* search Icon */}
                    <FeatherIcon name="search" size={30} color={clicked ? Colors.dark_blue_color : Color.main_color} onPress={() => {

                    }} />

                    {/* Input field */}
                    <TextInput
                        style={styles.input}
                        placeholder="Search for an Event"
                        value={searchPhrase}
                        onChangeText={setSearchPhrase}
                        onFocus={() => {
                            setClicked(true);
                        }}
                    />
                    {/* cross Icon, depending on whether the search bar is clicked or not */}
                    {clicked && (
                        <Icon name="cross" size={30} color="#900" onPress={() => {
                            Keyboard.dismiss();
                            setSearchPhrase("");
                            setClicked(false);
                        }} />
                    )}
                </View>
            </View>
            {searchPhrase != "" ? (<>
                <TouchableOpacity style={styles.searchBtn} onPress={search}>
                    <Text style={styles.searchText}>Search</Text>
                </TouchableOpacity>
            </>) : (<></>)}
            {description ? (<>
                <View style={styles.searchDescription}>

                    <Text style={styles.searchTitle1}>
                        Search by name or event ID
                    </Text>
                    <Text style={styles.searchTitle2}>
                        Your event ID was emailed to you by the event organizer
                    </Text>
                </View>

            </>) : (<>

            </>)}
        </View>
    );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
    center: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",

    },
    container: {
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",


    },
    searchBar__unclicked: {
        padding: 8,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.main_color,
        borderRadius: 25,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 8,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.dark_blue_color,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        width: "80%",
    },
    searchBtn: {
        backgroundColor: Colors.main_color,
        color: Colors.white,

        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 20
    },
    searchText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchDescription: {
        marginVertical: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchTitle1: {
        color: Colors.main_color,
        fontSize: aspectRatio > 1.6 ? 16 : 20,
        textAlign: 'center',
    },
    searchTitle2: {
        paddingVertical: 6,
        paddingHorizontal: 30,
        color: Colors.dark_grey_color,
        fontSize: aspectRatio > 1.6 ? 16 : 20,
        textAlign: 'center',

    },
});